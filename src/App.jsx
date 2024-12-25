import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; // Adjust path based on your folder structure
import PatientDashboard from './PatientDashboard.jsx';
import DoctorDashboard from './DoctorDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;