from supabase import create_client
import os

url = "https://afvyzztqauaklbwzhdsd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdnl6enRxYXVha2xid3poZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Njg5MDgsImV4cCI6MjA3MTQ0NDkwOH0.kARibBlN-lb0KXCqeprVeEuVEgKTOn76GL5m1da2lk4"
supabase = create_client(url, key)

def upload_file(user_id, file_path):
    with open(file_path, "rb") as f:
        res = supabase.storage.from_("evidence").upload(f"user_{user_id}/{os.path.basename(file_path)}", f)
        return res


def upload_file(user_id, file_path):
    with open(file_path, "rb") as f:
        res = supabase.storage.from_("Evidence").upload(f"user_{user_id}/{os.path.basename(file_path)}", f)
        return res
    
def upload_profile_picture(user_id, file_path):
    with open(file_path, "rb") as f:
        res = supabase.storage.from_("Profile_img").upload(
            f"user_{user_id}/{os.path.basename(file_path)}", f
        )
        return res
