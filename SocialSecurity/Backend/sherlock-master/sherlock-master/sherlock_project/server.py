from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess, requests, json, re
import psycopg2


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


sites = {
    "Instagram": "https://www.instagram.com/{}/",
    "TikTok": "https://www.tiktok.com/@{}",
    "Twitter": "https://twitter.com/{}"
}

def get_db_connection():
    return psycopg2.connect(
        dbname="Social_Security",
        user="postgres",
        password="itumeleng",  
        host="localhost",
        port="5432"
    )


def check_username_on_sites(username):
    results = {}
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"  
    }

    for site, url_format in sites.items():
        url = url_format.format(username)
        try:
            response = requests.get(url, headers=headers, timeout=5)
            if response.status_code == 200:
                results[site] = "Found"
            elif response.status_code == 404:
                results[site] = "Not Found"
            else:
                results[site] = f"Unknown response: {response.status_code}"
        except requests.RequestException as e:
            results[site] = f"Error: {str(e)}"
    return results

def run_sherlock(username):
    try:
        result = subprocess.run(
            ["python", "sherlock.py", username], capture_output=True, text=True
        )
        output = result.stdout.strip()
        sherlock_json = {}

        for line in output.splitlines():
            line = line.strip()
            if line.startswith("[+]"):
                match = re.match(r"\[\+\]\s*(.+?):\s*(.+)", line)
                if match:
                    platform, url = match.groups()
                    sherlock_json[platform] = url

        return sherlock_json
    
    except Exception as e: 
        print(f"Error running Sherlock: {e}") 
        return None

@app.get("/scan/{username}")
def scan_username(username: str, user_id: str):
    sherlock_results = run_sherlock(username)
    manual_results = check_username_on_sites(username)

    action = f"Scanned username: {username}"
    details = f"Sherlock found {len(sherlock_results or {})}, Manual found {len(manual_results or {})}"

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO logs (user_id, action, details)
        VALUES (%s, %s, %s)
        RETURNING *;
    """, (user_id, action, details))
    log = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    print(sherlock_results)
    print(manual_results)

    return {
        "Sherlock Results": sherlock_results,
        "Manual Checks": manual_results
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8002, reload=True)
