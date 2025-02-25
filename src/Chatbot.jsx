import ChatBot from "react-chatbotify";
import { useState } from "react";

const fetchPatientDocuments = async (patientId) => {
    const patientDatabase = {
        "12345": ["Blood Test Report - Normal", "MRI Scan - Mild Inflammation"],
        "67890": ["X-Ray - No Fracture", "ECG Report - Normal Heart Rhythm"],
        "54321": ["Diabetes Report - High Glucose Levels", "Prescription - Metformin"]
    };
    return patientDatabase[patientId] || ["No records found for this patient."];
};

const DoctorChatBot = () => {
    const [documents, setDocuments] = useState([]);

    const flow = {
        start: {
            message: "Hello, I am your medical assistant chatbot 🏥! I can summarize patient details for the doctor.",
            transition: { duration: 1000 },
            path: "ask_patient_id"
        },
        ask_patient_id: {
            message: "Please provide the patient's ID.",
            userInput: true,
            path: "fetch_patient_documents"
        },
        fetch_patient_documents: {
            message: "Fetching documents for the patient...",
            chatDisabled: true,
            path: async (params) => {
                const patientId = params.userInput;
                const patientDocs = await fetchPatientDocuments(patientId);
                setDocuments(patientDocs); // Store fetched documents

                const documentList = patientDocs.length > 0
                    ? patientDocs.map(doc => `- ${doc}`).join("\n")
                    : "No records found for this patient.";

                // Inject the document list into the chat flow
                await params.injectMessage(`Here are the documents for patient ID ${patientId}: \n${documentList}`);

                return "end_conversation";
            }
        },
        end_conversation: {
            message: "Thank you! Have a great day! 😊",
            transition: { duration: 3000 },
            path: "start"
        }
    };

    return (
        <ChatBot 
            settings={{ general: { embedded: true }, chatHistory: { storageKey: "doctor_chatbot" } }}
            flow={flow}
        />
    );
};

export default DoctorChatBot;
