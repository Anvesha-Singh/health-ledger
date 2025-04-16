import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import DoctorDetails from './components/DoctorDetails';
import PatientList from './components/PatientList';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';
import './styles.css';

const DoctorDashboard = () => {
  const { contract } = useContext(ContractContext);
  const navigate = useNavigate();
  const [patientAddress, setPatientAddress] = useState('');
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!patientAddress || !patientName) return;

    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      await contract.methods.addPatient(patientAddress, patientName)
        .send({ from: accounts[0], gas: 500000 });
      
      setPatientAddress('');
      setPatientName('');
    } catch (err) {
      console.error('Error adding patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      {/* Doctor Details Section */}
      <div className="dashboard-section">
        <h4>Profile</h4>
        <DoctorDetails />
      </div>
      
      {/* Add Patient Form */}
      <div className="dashboard-section">
        <h4>Add New Patient</h4>
        <form onSubmit={handleAddPatient} className="add-patient-form">
          <input
            type="text"
            placeholder="Patient Address"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
          <button 
            className="all-btns" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : '+ Add Patient'}
          </button>
        </form>
      </div>

      {/* Patient List */}
      <div className="dashboard-section">
        <h4>Your Patients</h4>
        <PatientList />
      </div>
    </div>
  );
};

export default DoctorDashboard;