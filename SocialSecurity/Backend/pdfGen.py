from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fpdf import FPDF
import shutil
import os
import uuid

app = FastAPI()

# Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/pdfGen/")
async def generate_pdf(
    title: str = Form(...),
    description: str = Form(...),
    attachments: list[UploadFile] = File(default=[])
):
    print(f"Received request - Title: {title}, Description: {description[:50]}...")
    print(f"Number of attachments: {len(attachments)}")
    
    try:
        # Save attachments temporarily
        attachment_names = []
        for file in attachments:
            original_name = file.filename or "unnamed_file"
            file_extension = os.path.splitext(original_name)[1] if '.' in original_name else '.bin'
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            print(f"Saving attachment: {original_name} as {unique_filename}")
            
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            attachment_names.append({
                'original_name': original_name,
                'saved_name': unique_filename
            })

        # Generate PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, f"Incident Title: {title}", ln=True)
        pdf.ln(5)
        pdf.set_font("Arial", "", 12)
        
        # Handle long descriptions by splitting into chunks
        desc_chunks = [description[i:i+80] for i in range(0, len(description), 80)]
        for chunk in desc_chunks:
            pdf.multi_cell(0, 10, chunk)
        
        pdf.ln(5)

        if attachment_names:
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Attachments:", ln=True)
            pdf.ln(5)

            for attachment in attachment_names:
                file_path = os.path.join(UPLOAD_DIR, attachment['saved_name'])
                ext = attachment['original_name'].split('.')[-1].lower()

                if ext in ['jpg', 'jpeg', 'png']:
                    try:
                        # Check if adding the image would exceed page height
                        # Assuming A4 page ~297mm height, margin ~10mm
                        # current_y = pdf.get_y()
                        # if current_y + 100 > 287:
                        #     pdf.add_page()

                        # Add image scaled to width=150
                        pdf.image(file_path, w=150)
                        pdf.ln(5)
                    except Exception as e:
                        pdf.set_font("Arial", "", 12)
                        pdf.cell(0, 10, f"Could not embed image {attachment['original_name']}", ln=True)
                else:
                    pdf.set_font("Arial", "", 12)
                    pdf.cell(0, 10, f"- {attachment['original_name']}", ln=True)


        # Generate unique PDF name
        pdf_filename = f"incident_{uuid.uuid4()}.pdf"
        pdf_path = os.path.join(UPLOAD_DIR, pdf_filename)
        pdf.output(pdf_path)
        
        print(f"PDF generated successfully: {pdf_filename}")
        print(f"PDF file size: {os.path.getsize(pdf_path)} bytes")
        
        # Clean up attachment files
        for attachment in attachment_names:
            try:
                os.remove(os.path.join(UPLOAD_DIR, attachment['saved_name']))
                print(f"Cleaned up attachment: {attachment['saved_name']}")
            except Exception as e:
                print(f"Error cleaning up attachment: {e}")

        return FileResponse(
            pdf_path, 
            filename=pdf_filename,
            media_type='application/pdf'
        )
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        # Clean up on error
        for attachment in attachment_names:
            try:
                os.remove(os.path.join(UPLOAD_DIR, attachment['saved_name']))
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "Server is running"}

@app.get("/test-pdf")
async def test_pdf():
    """Test endpoint to verify PDF generation works"""
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, "Test PDF", ln=True)
        pdf.cell(0, 10, "This is a test PDF from the server", ln=True)
        
        pdf_filename = "test.pdf"
        pdf_path = os.path.join(UPLOAD_DIR, pdf_filename)
        pdf.output(pdf_path)
        
        return FileResponse(pdf_path, filename=pdf_filename)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)