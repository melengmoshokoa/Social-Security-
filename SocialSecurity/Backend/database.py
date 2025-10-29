from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection
import os

app = Flask(__name__)
CORS(app)


def log_action(user_id, action, details=""):
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
    return log

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    firebase_uid = data.get('firebase_uid')
    username = data.get('username')
    email = data.get('email')

    print("opening connection...")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO users (id, username, email)
        VALUES (%s, %s, %s)
        RETURNING *;
    """, (firebase_uid, username, email))
    user = cur.fetchone()
    conn.commit()
    print("Inserted user:", user)
    cur.close()
    conn.close()

    print("created user")
    log_action(firebase_uid, "Account Created", f"Username: {username}, Email: {email}")

    return jsonify({
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "created_at": user[3]
        }), 201

@app.route('/reports', methods=['POST'])
def create_report():
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('report_title')
    details = data.get('report_details')
    drive_id = data.get('drive_id')
    pdf_hash = data.get('pdf_hash')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO reports (user_id, report_title, report_details, drive_id, pdf_hash)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING *;
""", (user_id, title, details, drive_id, pdf_hash))
    report = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    log_action(user_id, "Report Created", f"Title: {title}")

    return jsonify({
        "id": report[0],
        "user_id": report[1],
        "report_title": report[2],
        "report_details": report[3],
        "created_at": report[4],
    }), 201

@app.route('/getReports', methods=['GET'])
def get_reports():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM reports ORDER BY created_at ASC;")
    reports = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "user_id": r[1],
            "report_title": r[2],
            "report_details": r[3],
            "created_at": r[4],
            "drive_id": r[5],
            "pdf_hash": r[6],
        } for r in reports
    ])

@app.route('/logs', methods=['POST'])
def create_log():
    data = request.get_json()
    user_id = data.get('user_id')
    action = data.get('action')
    details = data.get('details')

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

    return jsonify({
        "id": log[0],
        "user_id": log[1],
        "action": log[2],
        "details": log[3],
        "created_at": log[4],
    }), 201

@app.route('/logs/<user_id>', methods=['GET'])
def get_logs(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM logs WHERE user_id = %s ORDER BY created_at DESC;
    """, (user_id,))
    logs = cur.fetchall()
    cur.close()
    conn.close()

    print("got logs...")

    return jsonify([
        {
            "id": l[0],
            "user_id": l[1],
            "action": l[2],
            "details": l[3],
            "created_at": l[4],
        } for l in logs
    ])
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
