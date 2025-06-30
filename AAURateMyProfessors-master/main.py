import requests
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "authority": "portal.aau.edu.et",
    "method": "POST",
    "path": "/api/GrandWebsite/GetStaffs?Page=3",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "origin": "https://www.aau.edu.et",
    "referer": "https://www.aau.edu.et/",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "content-type": "application/json"
}

output_file = "staffs1.json"
all_responses = []

try:
    for page in range(1, 105):
        url = f"https://portal.aau.edu.et/api/GrandWebsite/GetStaffs?Page={page}"
        data = json.dumps({"page": page})
        response = requests.post(url, headers=headers, data=data)
        try:
            resp_json = response.json()
        except Exception:
            resp_json = {"error": "Invalid JSON", "page": page, "content": response.text}
        all_responses.append(resp_json)
        print(f"Page {page} done.")
except Exception as e:
    print(f"An error occurred: {e}")
    # Save progress so far
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_responses, f, ensure_ascii=False, indent=2)
    raise

# Save all responses as a valid JSON array
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_responses, f, ensure_ascii=False, indent=2)