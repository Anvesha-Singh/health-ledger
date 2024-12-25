import React from 'react';
import Header from './components/Header';
import AdminDetails from './components/AdminDetails';
import './styles.css';

const AdminDashboard = () => (
  <div className="app-container">
    <Header />
    <h1 className="dashboard-title">Admin Dashboard</h1>
    <AdminDetails />
    <div className="patient-actions">
        <button className="all-btns">Doctor Directory</button>
        <button className="all-btns">Appointment Schedule</button>
    </div>
  </div>
);

export default AdminDashboard;