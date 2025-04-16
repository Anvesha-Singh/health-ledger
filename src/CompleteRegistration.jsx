import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from './context/ContractContext';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './styles.css';

const CompleteRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    username: '',
    specialization: ''
  });
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const contract = useContext(ContractContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      try {
        const userRole = await contract.methods.roles(accounts[0]).call();
        setRole(userRole.toString());

        // Redirect if already registered
        switch(userRole) {
          case '1': // Patient
            const patient = await contract.methods.patients(accounts[0]).call();
            if (patient.name !== '') navigate('/patient-dashboard');
            break;
          case '2': // Doctor
            const doctor = await contract.methods.doctors(accounts[0]).call();
            if (doctor.name !== '') navigate('/doctor-dashboard');
            break;
          default:
            navigate('/');
        }
      } catch (err) {
        navigate('/');
      }
    };

    checkRegistrationStatus();
  }, [contract, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      if (role === '1') { // Patient
        await contract.methods.registerPatient(
          formData.name,
          parseInt(formData.age),
          formData.gender,
          formData.username
        ).send({ from: accounts[0] });
        navigate('/patient-dashboard');
      } 
      else if (role === '2') { // Doctor
        // If doctors are added by admins, this might need contract modification
        await contract.methods.registerDoctor(
          formData.name,
          formData.specialization
        ).send({ from: accounts[0] });
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      setError(err.message.includes('revert') 
        ? 'Registration failed. Check your details.' 
        : 'Transaction failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (role === '1') { // Patient
      return (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </>
      );
    }
    
    if (role === '2') { // Doctor
      return (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            required
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Complete Your Registration</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {renderFormFields()}
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="all-btns"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;