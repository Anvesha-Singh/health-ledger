from flask import Flask, request, jsonify
import os
import json
import requests
import fitz  # PyMuPDF
from dotenv import load_dotenv
from flask_cors import CORS
import tempfile

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/summarize": {"origins": "http://localhost:5173"}}, supports_credentials=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def extract_text_from_pdf(pdf_path):
    print(f"Extracting text from: {pdf_path}")
    try:
        doc = fitz.open(pdf_path)
        text = "\n".join(page.get_text("text") for page in doc if page.get_text("text"))
        print(f"Extracted text (first 500 chars): {text[:500]!r}")
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_json(text):
    import re
    # Try to extract JSON from code block
    match = re.search(r'``````', text, re.DOTALL)
    if match:
        print("Extracted JSON from code block.")
        return match.group(1)
    # Try to extract first {...} block
    match = re.search(r'(\{.*\})', text, re.DOTALL)
    if match:
        print("Extracted JSON from curly braces.")
        return match.group(1)
    print("No JSON found, returning raw text.")
    return text

def generate_summary(text, filename):
    print(f"Generating summary for: {filename}")
    if not text:
        print(f"No text extracted from {filename}, returning N/A.")
        return {
            "File Name": filename,
            "Existing Health Conditions": "N/A",
            "Current Medications": "N/A",
            "Anomalies or Concerns": "N/A",
            "Abnormal Values": "N/A"
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    prompt = f"""
    Extract and summarize the following medical record in JSON format with these keys:
    - Existing Health Conditions
    - Current Medications
    - Anomalies or Concerns
    - Abnormal Values
    No additional text, just a valid JSON response.

    Medical Record: {text}
    """
    print("Prompt sent to Gemini (first 500 chars):", prompt[:500])

    data = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        print(f"Gemini API status: {response.status_code}")
        print("Gemini API raw response:", response.text[:1000])
        if response.status_code == 200:
            api_response = response.json()
            if "candidates" in api_response and api_response["candidates"]:
                summary_text = api_response["candidates"][0]["content"]["parts"][0]["text"]
                print("Gemini summary text (first 500 chars):", summary_text[:500])
                extracted_json = extract_json(summary_text)
                try:
                    structured_summary = json.loads(extracted_json)
                    print("Parsed structured summary:", structured_summary)
                    return {"File Name": filename, **structured_summary}
                except json.JSONDecodeError:
                    print("Failed to parse AI response as JSON.")
                    return {"File Name": filename, "Error": "Failed to parse AI response as JSON."}
            else:
                print("No candidates in Gemini response.")
        else:
            print("Gemini API returned non-200 status.")
    except Exception as e:
        print(f"Exception during Gemini API call: {e}")

    print("Summary generation failed or empty response.")
    return {"File Name": filename, "Error": "Summary generation failed or empty response."}

def download_file(url):
    print(f"Downloading file from: {url}")
    try:
        response = requests.get(url)
        if response.status_code == 200:
            temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            temp.write(response.content)
            temp.close()
            print(f"File downloaded to: {temp.name} (size: {os.path.getsize(temp.name)} bytes)")
            return temp.name
        else:
            print(f"Failed to download file, status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception during file download: {e}")
        return None

@app.route("/summarize", methods=["POST"])
def summarize_patient():
    try:
        data = request.get_json()
        print("Received data:", data)
        files = data.get("files", [])
        if not files:
            print("No files provided.")
            return jsonify({"error": "No files provided"}), 400

        consolidated_summary = {
            "Existing Health Conditions": [],
            "Current Medications": [],
            "Anomalies or Concerns": [],
            "Abnormal Values": []
        }

        for file in files:
            url = file.get("url")
            filename = file.get("fileName")
            print(f"Processing file: {filename}, URL: {url}")
            if url and filename and filename.lower().endswith(".pdf"):
                pdf_path = download_file(url)
                if pdf_path:
                    extracted_text = extract_text_from_pdf(pdf_path)
                    summary_result = generate_summary(extracted_text, filename)
                    # Clean up temp file
                    try:
                        os.remove(pdf_path)
                        print(f"Deleted temp file: {pdf_path}")
                    except Exception as e:
                        print(f"Failed to delete temp file: {e}")
                    for key in consolidated_summary.keys():
                        consolidated_summary[key].append(summary_result.get(key, "N/A"))
                else:
                    print(f"Failed to download file: {filename}")
                    for key in consolidated_summary.keys():
                        consolidated_summary[key].append("Failed to download file.")
            else:
                print(f"Not a PDF or missing URL for file: {filename}")
                for key in consolidated_summary.keys():
                    consolidated_summary[key].append("Not a PDF or missing URL.")

        print("Final consolidated summary:", consolidated_summary)
        return jsonify({"summary": consolidated_summary})

    except Exception as e:
        print("Error in /summarize:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)