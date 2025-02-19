import React from 'react';
import Header from './components/Header';
import PatientDetails from './components/PatientDetails';
import './styles.css';

const PatientDashboard = () => (
  <div className="app-container">
    <Header />
    <h1 className="dashboard-title">Patient Dashboard</h1>
    <PatientDetails />
    <div className="patient-actions">
        <button className="all-btns">View History</button>
        <button className="all-btns">Add Prescription</button>
        <button className="all-btns">AI Chatbot</button>
    </div>
  </div>
);

export default PatientDashboard;