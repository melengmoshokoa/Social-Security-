from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("firebase-service-key.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)

@app.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    id_token = data.get("token")
    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"]
        return jsonify({"status": "success", "uid": uid}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)
