from flask import Flask, request, jsonify
import os
import json
import requests
import fitz  
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
load_dotenv()

CORS(app, resources={r"/summarize": {"origins": "http://localhost:5173"}}, supports_credentials=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
REPORTS_FOLDER = "reports"  

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text("text") for page in doc if page.get_text("text"))
    return text.strip()

import json
import re

def extract_json(text):
    """Extract JSON content from AI response"""
    match = re.search(r'```json\s*(\{.*?\})\s*```', text, re.DOTALL)
    return match.group(1) if match else text  # Extract JSON content or return as-is

def generate_summary(text, filename):
    if not text:
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

    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    if response.status_code == 200:
        api_response = response.json()
        if "candidates" in api_response and api_response["candidates"]:
            summary_text = api_response["candidates"][0]["content"]["parts"][0]["text"]
            extracted_json = extract_json(summary_text)  # Extract JSON portion
            try:
                structured_summary = json.loads(extracted_json)  # Parse JSON
                return {"File Name": filename, **structured_summary}
            except json.JSONDecodeError:
                return {"File Name": filename, "Error": "Failed to parse AI response as JSON."}
    
    return {"File Name": filename, "Error": "Summary generation failed or empty response."}

@app.route("/summarize", methods=["POST"])
def summarize_patient():
    try:
        data = request.get_json()
        print("Received data:", data)

        patient_id = data.get("patient_id")
        if not patient_id:
            return jsonify({"error": "Missing patient_id"}), 400

        patient_folder = os.path.join(REPORTS_FOLDER, patient_id)
        if not os.path.exists(patient_folder):
            return jsonify({"error": "Patient folder not found"}), 404

        consolidated_summary = {
            "Existing Health Conditions": [],
            "Current Medications": [],
            "Anomalies or Concerns": [],
            "Abnormal Values": []
        }

        for filename in os.listdir(patient_folder):
            file_path = os.path.join(patient_folder, filename)
            if filename.endswith(".pdf"):
                print("Processing file:", filename)
                extracted_text = extract_text_from_pdf(file_path)
                summary_result = generate_summary(extracted_text, filename)
                print("Generated summary:", summary_result)
                
                for key in consolidated_summary.keys():
                    consolidated_summary[key].append(summary_result.get(key, "N/A"))

        return jsonify({"patient_id": patient_id, "summary": consolidated_summary})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)