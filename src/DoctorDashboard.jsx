import React from 'react';
import Header from './components/Header';
import DoctorDetails from './components/DoctorDetails';
import PatientList from './components/PatientList';
import './styles.css';

const DoctorDashboard = () => (
  <div className="app-container">
    <Header />
    <h1 className="dashboard-title">Doctor Dashboard</h1>
    <DoctorDetails />
    <button className="add-patient-btn">+ Add Patient</button>
    <PatientList />
  </div>
);

export default DoctorDashboard;