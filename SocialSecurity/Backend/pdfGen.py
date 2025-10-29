from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fpdf import FPDF
import os
import uuid
import hashlib
from supabase import create_client, Client
from datetime import datetime
import psycopg2
import asyncio
from dotenv import load_dotenv

load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

@app.post("/pdfGen/")
async def generate_pdf(
    title: str = Form(...),
    description: str = Form(...),
    user_id: str = Form(...),
    attachments: list[UploadFile] = File(default=[])
):
    print(f"Received request - Title: {title}, Description: {description[:50]}...")
    print(f"User ID: {user_id}")
    print(f"Attachments: {len(attachments)}")

    try:
        attachment_names = []
        for file in attachments:
            original_name = file.filename or "unnamed_file"
            ext = os.path.splitext(original_name)[1] or ".bin"
            unique_filename = f"{uuid.uuid4()}{ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)

            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)

            attachment_names.append({
                'original_name': original_name,
                'saved_name': unique_filename
            })

        # --- Generate PDF ---
        pdf = FPDF()
        pdf.add_page()
        pdf.add_font('DejaVu', '', 'fonts/DejaVuSans.ttf', uni=True)
        pdf.set_font('DejaVu', '', 16)
        pdf.cell(0, 10, f"Incident Title: {title}", ln=True)
        pdf.ln(5)
        pdf.set_font('DejaVu', '', 12)
        pdf.multi_cell(0, 8, description)
        pdf.ln(5)

        if attachment_names:
            pdf.set_font('DejaVu', '', 14)
            pdf.cell(0, 10, "Attachments:", ln=True)
            pdf.ln(5)
            for att in attachment_names:
                path = os.path.join(UPLOAD_DIR, att["saved_name"])
                ext = att["original_name"].split(".")[-1].lower()
                if ext in ["jpg", "jpeg", "png"]:
                    try:
                        pdf.image(path, w=100)
                        pdf.ln(5)
                    except Exception:
                        pdf.cell(0, 10, f"- {att['original_name']} (image failed)", ln=True)
                else:
                    pdf.cell(0, 10, f"- {att['original_name']}", ln=True)

        pdf_filename = f"incident_{uuid.uuid4()}.pdf"
        pdf_path = os.path.join(UPLOAD_DIR, pdf_filename)
        pdf.output(pdf_path)

        # --- Hash PDF ---
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
        pdf_hash = hashlib.sha256(pdf_bytes).hexdigest()

        # --- Upload to Supabase ---
        bucket_name = "reports-pdfs"
        storage_path = f"{user_id}/{pdf_filename}"
        supabase.storage.from_(bucket_name).upload(storage_path, file=pdf_bytes)
        public_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO reports (user_id, report_title, report_details, drive_id, pdf_hash, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (user_id, title, description, storage_path, pdf_hash, datetime.utcnow()))
        report_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        response = FileResponse(
            path=pdf_path,
            filename=pdf_filename,
            media_type='application/pdf'
        )

        # Schedule file cleanup after sending
        async def cleanup_file():
            await asyncio.sleep(2)  # wait for response to finish
            os.remove(pdf_path)
            for a in attachment_names:
                os.remove(os.path.join(UPLOAD_DIR, a['saved_name']))

        asyncio.create_task(cleanup_file())

        return response


    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


@app.get("/")
async def health_check():
    return {"status": "Server is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
