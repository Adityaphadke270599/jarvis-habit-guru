import base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build 
from mcp.server.fastmcp import FastMCP

from google_auth import get_credentials

## FastMCP is the object that represents the FastMCP server. It is used to handle the conversion of plain python functions to MCP tools. 
## build() is the function that builds the Google API client. It is used to create a service object that can be used to call the Google APIs.
## get_credentials() is the function that gets the credentials for the Google APIs. It is used to authenticate the user and get the access token.
## base64 is the module that is used to encode the email message in base64 format. It is used to send the email message in the correct format.

creds = get_credentials()
calendar_service = build("calendar", "v3", credentials=creds)
gmail_service = build("gmail", "v1", credentials=creds)

mcp = FastMCP("jarvis-google-tools")

##get_credentials() will silently reuse and refresh your cached token.json now
@mcp.tool()
def list_calendar_events(time_min: str, time_max: str, max_results: int = 10) -> str:
    """
    List the events in the user's calendar between the specified time range.

    Args:
        time_min (str): The minimum time for the events to be listed.
        time_max (str): The maximum time for the events to be listed.  """
    result = calendar_service.events().list(
        calendarId="primary",
        timeMin=time_min,
        timeMax=time_max,
        maxResults=max_results,
        singleEvents=True,
        orderBy="startTime",
    ).execute()
    events = result.get("items", [])
    if not events:
        return "No events found."
    lines = []
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        lines.append(f"{event['id']} | {start} | {event.get('summary', 'No summary available')}")
    return "\n".join(lines)
#Update Calendar Event, Delete Calendar Event, Create Calendar Event
@mcp.tool()
def update_calendar_event(event_id: str, summary: str = "", description: str = "", start_time: str = "", end_time: str = "") -> str:
    """Update an existing calendar event by its ID. Only the fields you provide are changed."""
    patch_body = {}
    if summary:
        patch_body["summary"] = summary
    if description:
        patch_body["description"] = description
    if start_time:
        patch_body["start"] = {"dateTime": start_time}
    if end_time:
        patch_body["end"] = {"dateTime": end_time}
    updated = calendar_service.events().patch(calendarId="primary", eventId=event_id, body=patch_body).execute()
    return f"Updated event {updated['id']}"

@mcp.tool()
def delete_calendar_event(event_id: str) -> str:
    """Delete a calendar event by its ID."""
    calendar_service.events().delete(calendarId="primary", eventId=event_id).execute()
    return f"Deleted event {event_id}"

@mcp.tool()
def create_calendar_event(summary: str, start_time: str, end_time: str, description: str = "") -> str:
    """Create a calendar event for a habit task. start_time and end_time are ISO 8601, e.g. 2026-07-04T09:00:00+05:30."""
    event = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_time},
        "end": {"dateTime": end_time},
    }
    created = calendar_service.events().insert(calendarId="primary", body=event).execute()
    return f"Created event {created['id']}: {created.get('htmlLink')}"

##
# @mcp.tool() is what registers this function as something Claude can call. FastMCP reads the function's type hints to build the tool's input schema automatically — no manual JSON schema needed.
# The docstring becomes the tool's description — this is literally what Claude reads to decide when to call this tool. Vague docstrings produce a model that doesn't know when to reach for the tool.
# singleEvents=True expands recurring events (e.g. a daily habit task) into individual dated instances rather than one repeating-event blob — you want this so Jarvis can address "today's" instance specifically.
# Every event's id gets included in the output on purpose — you'll need it for update/delete.
##
if __name__ == "__main__":
    mcp.run()