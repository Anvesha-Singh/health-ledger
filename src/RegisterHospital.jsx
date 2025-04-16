// RegisterHospital.jsx
import React, { useState, useContext } from 'react';
import { ContractContext } from './context/ContractContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const RegisterHospital = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [error, setError] = useState('');
  const contract = useContext(ContractContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerHospital(hospitalName)
        .send({ from: accounts[0] });
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Registration failed. ' + (err.message || ''));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Register Your Hospital</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
          />
          <button type="submit" className="all-btns">
            Register Hospital
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterHospital;