import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("firebase-service-key.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded['uid']
    except Exception:
        return None
