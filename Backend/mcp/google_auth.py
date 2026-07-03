import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
## Crdentials is the object that represnets that Jarvis is allowed to call the Google APIs.
## InstalledAppFlow is the object that represents the flow of the OAuth2 process for installed applications. 
## Request is needed when we refresh an expired token.

SCOPES = [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/gmail.send",
]

TOKEN_PATH = "Backend/mcp/token.json"
CREDENTIALS_PATH = "Backend/mcp/credentials.json"

def get_credentials() -> Credentials:
    """
    Get the credentials for the Google APIs.

    Returns:
        Credentials: The credentials for the Google APIs.
    """
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
            ##save the token for next time.
        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())
    return creds

if __name__ == "__main__":
    get_credentials()
    print("OK")

