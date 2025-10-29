from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import zipfile
import io
import pandas as pd
from supabase import create_client, Client
import os
from bs4 import BeautifulSoup
import hashlib
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv

load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- FastAPI Setup ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

def generate_hash(data: bytes) -> str:
    """Generate SHA-256 hash for the given data"""
    return hashlib.sha256(data).hexdigest()

def store_zip_log(user_id: str, login_csv_hash: Optional[str] = None, messages_csv_hash: Optional[str] = None):
    """
    Store or update zip log entry in the database
    """
    try:

        existing_entry = supabase.table("zip_logs") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("login_csv_hash", login_csv_hash) \
            .eq("messages_csv_hash", messages_csv_hash) \
            .execute()
        
        if existing_entry.data:

            result = supabase.table("zip_logs") \
                .update({
                    "updated_at": datetime.utcnow().isoformat()
                }) \
                .eq("id", existing_entry.data[0]["id"]) \
                .execute()
        else:
            result = supabase.table("zip_logs") \
                .insert({
                    "user_id": user_id,
                    "login_csv_hash": login_csv_hash,
                    "messages_csv_hash": messages_csv_hash
                }) \
                .execute()
        
        if result.data:
            return result.data[0]
        else:
            print(f"Database error: {result.error}")
            return None
            
    except Exception as e:
        print(f"Error storing zip log: {e}")
        return None

def process_instagram_zip_bytes(zip_bytes: bytes, user_id: str):
    """
    Processes Instagram ZIP file from bytes and generates CSVs.
    Returns a dict with CSV filenames and bytes.
    """
    output = {}

    temp_dir = f"/tmp/instagram_data_{user_id}"
    os.makedirs(temp_dir, exist_ok=True)

    try:
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zip_ref:
            zip_ref.extractall(temp_dir)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid ZIP file")

    base_path = temp_dir

    login_file = os.path.join(base_path,
                              "security_and_login_information",
                              "login_and_profile_creation",
                              "login_activity.html")
    if os.path.exists(login_file):
        try:
            with open(login_file, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f, "html.parser")
            logins = [div.get_text(strip=True) for div in soup.find_all("div") if div.get_text(strip=True)]
            if logins:
                df_logins = pd.DataFrame(logins, columns=["Login Activity"])
                csv_bytes = df_logins.to_csv(index=False).encode("utf-8")
                output["login_activity.csv"] = csv_bytes
        except Exception as e:
            print(f"Error processing login activity: {e}")

    # --- Messages ---
    messages_dir = os.path.join(base_path, "messages", "inbox")
    if not os.path.exists(messages_dir):
        # Try alternative path
        messages_dir = os.path.join(base_path, "your_instagram_activity", "messages", "inbox")
    
    messages_data = []
    if os.path.exists(messages_dir):
        try:
            for user_folder in os.listdir(messages_dir):
                user_path = os.path.join(messages_dir, user_folder)
                if os.path.isdir(user_path):
                    for file in os.listdir(user_path):
                        if file.endswith(".html"):
                            file_path = os.path.join(user_path, file)
                            try:
                                with open(file_path, "r", encoding="utf-8") as f:
                                    soup = BeautifulSoup(f, "html.parser")
                                for div in soup.find_all("div"):
                                    text = div.get_text(strip=True)
                                    if text:
                                        messages_data.append({"User": user_folder, "Message": text})
                            except Exception as e:
                                print(f"Error processing message file {file_path}: {e}")
            if messages_data:
                df_messages = pd.DataFrame(messages_data)
                csv_bytes = df_messages.to_csv(index=False).encode("utf-8")
                output["messages.csv"] = csv_bytes
        except Exception as e:
            print(f"Error processing messages: {e}")

    # --- Posts ---
    posts_dir = os.path.join(base_path, "media", "posts")
    if not os.path.exists(posts_dir):
        posts_dir = os.path.join(base_path, "content", "posts")
    
    if os.path.exists(posts_dir):
        try:
            posts_data = []
            for f in os.listdir(posts_dir):
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.mp4', '.mov')):
                    posts_data.append({"Post File": f, "Path": os.path.join(posts_dir, f)})
            if posts_data:
                df_posts = pd.DataFrame(posts_data)
                csv_bytes = df_posts.to_csv(index=False).encode("utf-8")
                output["posts.csv"] = csv_bytes
        except Exception as e:
            print(f"Error processing posts: {e}")

    # Clean up temporary files
    try:
        import shutil
        shutil.rmtree(temp_dir)
    except:
        pass

    return output

def upload_csv_to_supabase(user_id: str, filename: str, csv_bytes: bytes):
    """
    Upload CSV to Supabase bucket 'user-logs'.
    """
    bucket_name = "user-logs"
    path = f"{user_id}/{filename}"
    
    try:
        # Check if bucket exists, create if not
        buckets = supabase.storage.list_buckets()
        bucket_names = [bucket.name for bucket in buckets]
        if bucket_name not in bucket_names:
            supabase.storage.create_bucket(bucket_name)
        
        # Upload file
        result = supabase.storage.from_(bucket_name).upload(path, csv_bytes)
        if hasattr(result, 'error') and result.error:
            raise Exception(f"Supabase upload failed: {result.error}")
        return f"{bucket_name}/{path}"
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload to storage: {str(e)}")

@app.post("/upload_instagram_zip/")
async def upload_instagram_zip(user_id: str = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")
    
    try:
        zip_bytes = await file.read()
        if len(zip_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
            
        csv_dict = process_instagram_zip_bytes(zip_bytes, user_id)

        if not csv_dict:
            return {
                "message": "ZIP processed but no relevant data found",
                "files": {},
                "database_entry": None
            }

        uploaded_files = {}
        login_csv_hash = None
        messages_csv_hash = None

        # Upload files and generate hashes
        for fname, bytes_data in csv_dict.items():
            path = upload_csv_to_supabase(user_id, fname, bytes_data)
            uploaded_files[fname] = path
            
            # Generate hashes for login and messages CSVs
            if fname == "login_activity.csv":
                login_csv_hash = generate_hash(bytes_data)
            elif fname == "messages.csv":
                messages_csv_hash = generate_hash(bytes_data)

        # Store in database
        db_entry = store_zip_log(user_id, login_csv_hash, messages_csv_hash)

        return {
            "message": "Instagram ZIP processed and CSVs uploaded",
            "files": uploaded_files,
            "database_entry": db_entry
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Server error: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Additional endpoint to get user's zip logs
@app.get("/user_zip_logs/{user_id}")
async def get_user_zip_logs(user_id: str):
    """
    Get all zip logs for a specific user
    """
    try:
        result = supabase.table("zip_logs") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        
        return {
            "user_id": user_id,
            "zip_logs": result.data if result.data else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch zip logs: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)