import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from './context/ContractContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Header from './components/Header';
import './styles.css';

const AdminDashboard = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contract = useContext(ContractContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        
        const hospital = await contract.methods.hospitals(accounts[0]).call();
        
        if (hospital.name === "") {
          navigate('/register-hospital');
        } else {
          setHospitalName(hospital.name);
        }
      } catch (err) {
        setError('Failed to initialize dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (contract) init();
  }, [contract, navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Initializing dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="hospital-info">
          <h2>{hospitalName}</h2>
          <p>Associated Hospital</p>
        </div>

        {/* Rest of your admin dashboard UI */}
      </div>
    </div>
  );
};

export default AdminDashboard;