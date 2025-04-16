import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './styles.css';

const PatientSignup = ({ contract, account }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) navigate('/');
  }, [account]);

  const handleRegistration = async () => {
    setLoading(true);
    setError('');
    try {
      await contract.methods.registerPatient()
        .send({ from: account });
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.message.includes('revert') 
        ? 'Address already registered' 
        : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Patient Registration</h2>
      <p>Connected account: {account}</p>
      
      <button 
        className="all-btns"
        onClick={handleRegistration}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Complete Registration'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PatientSignup;