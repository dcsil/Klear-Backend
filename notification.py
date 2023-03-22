import requests
import json

header = {"Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic NTUzZTY3MWUtNDRkMC00MTg2LWFjZmItMDIwZTlkMmNiMWFm"}

payload = {"app_id": "9ea06b9a-1433-4c15-ba13-3e8c70a63f52",
           "included_segments": ["Subscribed Users"],
           "contents": {"en": "Sample English Message"}}
 
req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
 
print(req.status_code, req.reason)