from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/drive.file']

flow = InstalledAppFlow.from_client_secrets_file('client_secret_859251457097-e3bjpsb1vdtc4l4rbhfv1dpteg7i7od7.apps.googleusercontent.com.json', SCOPES)
creds = flow.run_local_server(port=0)

print("Access Token:", creds.token)
print("Refresh Token:", creds.refresh_token)
print("Token Expiry:", creds.expiry)