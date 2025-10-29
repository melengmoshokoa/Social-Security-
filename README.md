# Social Security (S&S) App

Social Security (S&S) is a **social media identity protection app** that allows users to detect and report impersonation, monitor leaks, and manage reports securely.  

This project includes:  

- **React Native frontend** (Expo)  
- **Flask backend API** (Python)  
- **PostgreSQL database**  
---

## Features

- User registration and logging  
- Report creation and management  
- PDF generation for reports  
- Logging of all actions  
- React Native mobile frontend with Expo  
- Anomaly detection on accounts  
- Username search  
- Evidence storage  

---

## Prerequisites

Make sure you have the following installed:

- Node.js (v18+) & npm  
- Expo CLI (`npm install -g expo-cli`)  
- Python 3.10+  
- pip packages: Flask, Flask-CORS, psycopg2, python-dotenv, fpdf2, requests, etc.  
- PostgreSQL (local or Supabase)  

---

## Setup

```bash
git clone https://github.com/yourusername/Social-Security.git
cd Social-Security

    Install frontend dependencies

cd SocialSecurity
npm install

    Install backend dependencies

cd Backend
pip install -r requirements.txt

---
## Environment Variables / API Keys

Create a .env file in the backend (and optionally frontend) with the following:

# Database
DB_HOST=<your-db-host>
DB_PORT=5432
DB_NAME=<your-db-name>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>

# External API Keys
SERPAPI_KEY=<your-serpapi-key>
IMGBB_API_KEY=<your-imgbb-key>
APIFY_TOKEN=<your-apify-token>

# Supabase Storage (if used)
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>

# Firebase Configuration
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
FIREBASE_APP_ID=<your-firebase-app-id>

    Important: Do not commit .env to Git — it contains sensitive information.

## Running Backend Scripts

You can run each backend script independently depending on the functionality you need:

cd Backend

# Generate PDFs
python pdfGen.py

# Database operations
python database.py

# Reverse image search / anomaly detection
python reverse-image.py

# Start FastAPI server
python fastApi.py

# Upload ZIPs to storage
python upload_zip.py

Running the Sherlock server

cd sherlock-master/sherlock_project
python server.py

    Ensure your .env variables are loaded before running each script.

## Running the Frontend

    Start Expo:

cd SocialSecurity
expo start

    Use Expo Go app or simulator to run the mobile app.

    Make sure the frontend API_URL points to your backend (e.g., http://localhost:8000).

## Database Setup
Supabase

    Create a database in postgres.

    Create the required tables:

-- Users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    report_title TEXT,
    report_details TEXT,
    drive_id TEXT,
    pdf_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


## Notes

    Always create users before inserting reports to avoid foreign key errors.

    Ensure all .env keys and API credentials are valid.

    PDF generation requires fonts to be present in Backend/fonts/.

    For React Native assets, use require('./assets/<file>') unless served by Flask.

    Firebase config is required for authentication.

---
