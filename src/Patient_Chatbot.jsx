import React from "react";
import ChatBot from "react-chatbotify";

const PatientChatBot = () => {
    const flow = {
        start: {
            message: "Hello! I am your medical assistant chatbot 🏥. Let's get started with some details.",
            transition: { duration: 1000 },
            path: "ask_patient_name"
        },
        ask_patient_name: {
            message: "Please provide your full name.",
            userInput: true,
            path: "ask_patient_age"
        },
        ask_patient_age: {
            message: "Thank you! How old are you?",
            userInput: true,
            path: "ask_patient_id"
        },
        ask_patient_id: {
            message: "Please provide your patient ID.",
            userInput: true,
            path: "show_options"
        },
        show_options: {
            message: "Thanks for the information! What would you like to do?",
            options: ["Book Appointment", "Reschedule Appointment", "Get Prescription", "Get Test Document"],
            path: "process_options"
        },
        process_options: {
            transition: { duration: 0 },
            path: async (params) => {
                switch (params.userInput) {
                    case "Book Appointment":
                        return "ask_doctor_name";
                    case "Reschedule Appointment":
                        return "ask_doctor_name";
                    case "Get Prescription":
                        return "ask_doctor_name_prescription";
                    case "Get Test Document":
                        return "ask_diagnostic_name";
                    default:
                        return "unknown_input";
                }
            }
        },
        ask_doctor_name: {
            message: "Please provide the doctor's name.",
            userInput: true,
            path: "ask_hospital_name"
        },
        ask_hospital_name: {
            message: "Which hospital are you visiting?",
            userInput: true,
            path: "ask_appointment_time"
        },
        ask_appointment_time: {
            message: "Please provide the appointment time.",
            userInput: true,
            path: "ask_appointment_date"
        },
        ask_appointment_date: {
            message: "Please provide the appointment date.",
            userInput: true,
            path: "appointment_summary"
        },
        appointment_summary: {
            transition: { duration: 1000 },
            chatDisabled: true,
            path: async (params) => {
                const appointmentDetails = `
                    🗓️ **Appointment Details**:
                    - **Doctor's Name**: ${params.memory.ask_doctor_name}
                    - **Hospital**: ${params.memory.ask_hospital_name}
                    - **Time**: ${params.memory.ask_appointment_time}
                    - **Date**: ${params.memory.ask_appointment_date}
                `;
                await params.injectMessage("Booking your appointment... ⏳");
                setTimeout(() => {
                    params.injectMessage(appointmentDetails);
                    params.injectMessage("Your appointment has been successfully booked! 😊");
                }, 2000);
                return "repeat";
            }
        },
        ask_doctor_name_prescription: {
            message: "Please provide the doctor's name for the prescription.",
            userInput: true,
            path: "ask_hospital_name_prescription"
        },
        ask_hospital_name_prescription: {
            message: "Which hospital did you visit for the prescription?",
            userInput: true,
            path: "prescription_summary"
        },
        prescription_summary: {
            transition: { duration: 1000 },
            chatDisabled: true,
            path: async (params) => {
                const prescriptionDetails = `
                    📄 **Prescription Details**:
                    - **Doctor's Name**: ${params.memory.ask_doctor_name_prescription}
                    - **Hospital**: ${params.memory.ask_hospital_name_prescription}
                `;
                await params.injectMessage("Fetching your prescription... 📃");
                setTimeout(() => {
                    params.injectMessage(prescriptionDetails);
                    params.injectMessage("Your prescription is ready! 😊");
                }, 2000);
                return "repeat";
            }
        },
        ask_diagnostic_name: {
            message: "Please provide the diagnostic test name.",
            userInput: true,
            path: "test_document_summary"
        },
        test_document_summary: {
            transition: { duration: 1000 },
            chatDisabled: true,
            path: async (params) => {
                const testDocument = `
                    🧪 **Test Document**:
                    - **Diagnostic Test**: ${params.memory.ask_diagnostic_name}
                `;
                await params.injectMessage("Fetching your test document... 📑");
                setTimeout(() => {
                    params.injectMessage(testDocument);
                    params.injectMessage("Your test document is ready! 😊");
                }, 2000);
                return "repeat";
            }
        },
        unknown_input: {
            message: "Sorry, I did not understand your response 😢. Please try again.",
            path: "show_options"
        },
        repeat: {
            transition: { duration: 3000 },
            path: "start"
        }
    };

    return (
        <ChatBot 
            settings={{ general: { embedded: true }, chatHistory: { storageKey: "patient_chatbot" } }}
            flow={flow}
        />
    );
};

export default PatientChatBot;
