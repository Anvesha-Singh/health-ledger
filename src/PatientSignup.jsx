import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';
import logoImg from './assets/logo.png';
import './styles.css';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { contract } = useContext(ContractContext);
  const web3 = new Web3(window.ethereum);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.age || !formData.gender) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();

      await contract.methods.registerPatient(
        formData.name,
        parseInt(formData.age),
        formData.gender
      ).send({ from: accounts[0] });

      navigate('/patient-dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <header className="header">
          <div className="logo">
            <img src={logoImg} alt="Health Ledger Logo" />
            <h1>Health Ledger</h1>
          </div>
        </header>
        <h1 className="dashboard-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="all-btns" disabled={loading}>
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientSignup;