import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; 
import PatientDashboard from './PatientDashboard.jsx';
import DoctorDashboard from './DoctorDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import PatientSignup from './PatientSignup';
import HomePage from './HomePage.jsx';
import DoctorChatBot from './Chatbot.jsx';
import PatientChatBot from './Patient_Chatbot.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<PatientSignup />} />
        <Route path="/doc_chatbot" element={<DoctorChatBot />} />
        <Route path="/pat_chatbot" element={<PatientChatBot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;