from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil, uuid, requests, base64, os
from PIL import Image
import io
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Image Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path("temp_images")
TEMP_DIR.mkdir(exist_ok=True)

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

def optimize_image_for_upload(image_path: str, max_size_mb=8) -> str:
    """
    Optimize image for ImgBB upload while maintaining good quality
    """
    try:
        original_size = os.path.getsize(image_path) / (1024 * 1024)  # MB
        
        # If image is already under size limit, return as is
        if original_size <= max_size_mb:
            logger.info(f"Image size OK: {original_size:.2f}MB")
            return image_path
        
        img = Image.open(image_path)
        
        # Convert to RGB if necessary (removes alpha channel)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
            logger.info("Converted image to RGB")
        
        # Calculate scaling factor to get under size limit
        # Start with 80% quality and adjust dimensions if needed
        quality = 80
        scale_factor = 1.0
        
        if original_size > 15:  # Very large image
            scale_factor = 0.6
            quality = 85
        elif original_size > 10:
            scale_factor = 0.7
            quality = 85
        elif original_size > 5:
            scale_factor = 0.8
            quality = 90
        else:
            scale_factor = 0.9
            quality = 95
        
        new_width = int(img.width * scale_factor)
        new_height = int(img.height * scale_factor)
        
        logger.info(f"Resizing from {img.width}x{img.height} to {new_width}x{new_height}")
        
        # Use high-quality resampling
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save optimized image
        optimized_path = image_path.replace('.jpg', '_optimized.jpg')
        img.save(optimized_path, 'JPEG', quality=quality, optimize=True, progressive=True)
        
        optimized_size = os.path.getsize(optimized_path) / (1024 * 1024)
        logger.info(f"Optimized image: {original_size:.2f}MB -> {optimized_size:.2f}MB (quality: {quality})")
        
        return optimized_path
        
    except Exception as e:
        logger.warning(f"Image optimization failed: {e}")
        return image_path

def upload_to_imgbb_robust(image_path: str, max_retries=3) -> str:
    """
    Robust ImgBB upload with retries and proper error handling
    """
    for attempt in range(max_retries):
        try:
            # Optimize image first
            optimized_path = optimize_image_for_upload(image_path)
            
            with open(optimized_path, "rb") as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')
            
            logger.info(f"Upload attempt {attempt + 1} - Image data size: {len(image_data)} chars")
            
            # Use session for better connection handling
            with requests.Session() as session:
                response = session.post(
                    "https://api.imgbb.com/1/upload",
                    data={
                        'key': IMGBB_API_KEY,
                        'image': image_data,
                    },
                    timeout=30,  # Increased timeout
                    headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                )
            
            logger.info(f"ImgBB response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    image_url = data['data']['url']
                    logger.info(f"Upload successful: {image_url}")
                    return image_url
                else:
                    logger.error(f"ImgBB API error: {data.get('error', 'Unknown error')}")
            
            elif response.status_code == 400:
                error_msg = response.json().get('error', {}).get('message', 'Bad request')
                logger.error(f"ImgBB 400 error: {error_msg}")
                # Don't retry on 400 errors
                break
                
            else:
                logger.warning(f"ImgBB attempt {attempt + 1} failed with status {response.status_code}")
                
        except requests.exceptions.Timeout:
            logger.warning(f"ImgBB timeout on attempt {attempt + 1}")
        except requests.exceptions.ConnectionError:
            logger.warning(f"ImgBB connection error on attempt {attempt + 1}")
        except Exception as e:
            logger.error(f"ImgBB upload error on attempt {attempt + 1}: {e}")
        
        # Wait before retry (exponential backoff)
        if attempt < max_retries - 1:
            wait_time = (attempt + 1) * 2  # 2, 4, 6 seconds
            logger.info(f"Waiting {wait_time} seconds before retry...")
            import time
            time.sleep(wait_time)
    
    logger.error("All ImgBB upload attempts failed")
    return None

def get_direct_image_data(image_path: str) -> str:
    """Convert image to base64 for direct upload"""
    try:
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error reading image data: {e}")
        return None

@app.get("/")
async def root():
    return {"message": "Image Search API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "image-search"}

@app.post("/reverse-search")
async def reverse_search(
    file: UploadFile = File(...),
    user_id: str = Form(None)
):
    """
    Robust reverse image search with multiple fallback strategies
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate unique filename
    ext = Path(file.filename).suffix.lower() or ".jpg"
    tmp_name = f"{uuid.uuid4()}{ext}"
    tmp_path = TEMP_DIR / tmp_name
    
    optimized_path = None
    
    try:
        # Save uploaded file
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        file_size = os.path.getsize(tmp_path) / (1024 * 1024)  # MB
        logger.info(f"Processing image: {file.filename} ({file_size:.2f}MB)")

        # Validate file size
        if file_size > 20:  # 20MB limit
            return {
                "results": [], 
                "error": f"Image too large ({file_size:.1f}MB). Please use images under 20MB.",
                "advice": "Compress your image or use a smaller version"
            }

        if file_size < 0.01:  # 10KB minimum
            return {
                "results": [], 
                "error": "Image too small. Please use a higher quality image.",
                "advice": "Use original photos instead of heavily compressed versions"
            }

        # Strategy 1: Upload to ImgBB
        logger.info("Attempting ImgBB upload...")
        public_url = upload_to_imgbb_robust(str(tmp_path))
        
        # Strategy 2: Direct base64 upload as fallback
        image_data = None
        if not public_url:
            logger.info("ImgBB failed, trying direct base64 upload...")
            image_data = get_direct_image_data(str(tmp_path))

        if not public_url and not image_data:
            return {
                "results": [], 
                "error": "Failed to process image for search.",
                "advice": "Please try again with a different image"
            }

        # Prepare search parameters
        params = {
            "engine": "google_reverse_image",
            "api_key": SERPAPI_KEY,
            "num": 20
        }
        
        search_method = ""
        if public_url:
            params["image_url"] = public_url
            search_method = "imgbb_url"
            logger.info("Using ImgBB URL for search")
        else:
            params["image_content"] = image_data
            search_method = "direct_base64"
            logger.info("Using direct base64 for search")

        # Perform reverse image search
        logger.info("Sending request to SerpApi...")
        response = requests.get("https://serpapi.com/search", params=params, timeout=45)
        
        if response.status_code != 200:
            logger.error(f"SerpApi error: {response.status_code}")
            return {
                "results": [], 
                "error": "Search service temporarily unavailable.",
                "advice": "Please try again in a few minutes"
            }

        data = response.json()
        
        # Check for API errors
        if "error" in data:
            logger.error(f"SerpApi API error: {data['error']}")
            return {
                "results": [], 
                "error": f"Search API error: {data['error']}",
                "advice": "Please try a different image"
            }
        
        image_results = data.get("image_results", [])
        logger.info(f"Search completed: {len(image_results)} results found")
        
        # Format results
        formatted_results = []
        for i, result in enumerate(image_results[:15]):
            formatted_results.append({
                "title": result.get("title", "No title"),
                "link": result.get("link", ""),
                "thumbnail": result.get("thumbnail", ""),
                "source": result.get("source", ""),
                "position": i + 1
            })

        # Build response
        response_data = {
            "results": formatted_results,
            "total_found": len(formatted_results),
            "search_method": search_method,
            "image_size_mb": round(file_size, 2)
        }
        
        if public_url:
            response_data["uploaded_image_url"] = public_url

        # Add advice based on results
        if len(formatted_results) == 0:
            response_data["advice"] = [
                "No similar images found online",
                "This might be a personal/private photo",
                "Try using a more distinctive or higher quality image"
            ]
        elif len(formatted_results) < 5:
            response_data["advice"] = [
                f"Found {len(formatted_results)} potential matches",
                "Try using the original high-quality version of the image"
            ]

        return response_data

    except requests.exceptions.Timeout:
        logger.error("Search timeout")
        return {
            "results": [], 
            "error": "Search took too long to complete.",
            "advice": "Please try again with a smaller image"
        }
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            "results": [], 
            "error": "An unexpected error occurred during search.",
            "advice": "Please try again in a few moments"
        }
    finally:
        # Clean up temp files
        try:
            for file_path in [tmp_path]:
                if file_path and file_path.exists():
                    file_path.unlink()
            
            # Clean up optimized version if it exists
            if optimized_path and Path(optimized_path).exists():
                Path(optimized_path).unlink()
                
        except Exception as e:
            logger.warning(f"Cleanup warning: {e}")

if __name__ == "__main__":
    import uvicorn
    # Create temp directory if it doesn't exist
    TEMP_DIR.mkdir(exist_ok=True)
    
    logger.info("Starting Image Search API on port 8080...")
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="info")