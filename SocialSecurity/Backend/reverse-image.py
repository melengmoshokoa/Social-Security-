from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests, os, uuid, shutil
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = "AIzaSyDdlxpWfVH_4-nwR-rrQAp-DThcmulgin4"
SEARCH_ENGINE_ID = "17051cd1b05404e19"
TEMP_DIR = Path("temp_images")
TEMP_DIR.mkdir(exist_ok=True)

# Serve the temp folder
app.mount("/temp", StaticFiles(directory=TEMP_DIR), name="temp")

@app.post("/reverse-search")
async def reverse_search(file: UploadFile = File(...)):
    # Generate a unique filename
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    temp_path = TEMP_DIR / unique_name

    # Save temporarily
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    public_url = f"http://10.0.0.120:8081/temp/{unique_name}"  

    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_API_KEY,
        "cx": SEARCH_ENGINE_ID,
        "q": public_url,          
        "searchType": "image" 
    }

    response = requests.get(url, params=params)
    data = response.json()
    print("data output", data)

    temp_path.unlink(missing_ok=True)

    return {"results": data.get("items", [])}
