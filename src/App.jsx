import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import PatientDashboard from './PatientDashboard.jsx';
import DoctorDashboard from './DoctorDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import PatientSignup from './PatientSignup';
import ContractProvider from './context/ContractProvider';
import ProtectedRoute from './ProtectedRoute';
import PatientAppointment from './PatientAppointment.jsx';
import MedicalHistory from './MedicalHistory.jsx';

function App() {
  return (
    <ContractProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<PatientSignup />} />
          <Route path="/book-appointment" element={<PatientAppointment />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole={3}>
              <AdminDashboard />
            </ProtectedRoute>
          }/>
          
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute requiredRole={2}>
              <DoctorDashboard />
            </ProtectedRoute>
          }/>
          
          <Route path="/patient-dashboard" element={
            <ProtectedRoute requiredRole={1}>
              <PatientDashboard />
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </ContractProvider>
  );
}

export default App;