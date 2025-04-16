import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; 
import PatientDashboard from './PatientDashboard.jsx';
import DoctorDashboard from './DoctorDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import PatientSignup from './PatientSignup';
import ContractProvider from './context/ContractProvider';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <ContractProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<PatientSignup />} />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute role={2}>
              <AdminDashboard />
            </ProtectedRoute>
          }/>
          
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute role={1}>
              <DoctorDashboard />
            </ProtectedRoute>
          }/>
          
          <Route path="/patient-dashboard" element={
            <ProtectedRoute role={0}>
              <PatientDashboard />
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </ContractProvider>
  );
}

export default App;