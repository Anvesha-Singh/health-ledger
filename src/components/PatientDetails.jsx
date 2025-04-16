import React, { useEffect, useState, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Web3 from 'web3';
import '../styles.css';

const PatientDetails = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { contract } = useContext(ContractContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        const data = await contract.methods.patients(accounts[0]).call();
        
        setPatientData({
          name: data.name,
          age: data.age.toString(),
          gender: data.gender
        });
        
      } catch (err) {
        setError('Failed to load patient data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contract) loadData();
  }, [contract]);

  if (loading) return <div className="loading">Loading patient data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="details-card">
      <div className="detail-item">
        <span className="detail-label">Patient ID:</span>
        <span className="detail-value mono">{patientData.id}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Name:</span>
        <span className="detail-value">{patientData.name}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Age:</span>
        <span className="detail-value">{patientData.age}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Gender:</span>
        <span className="detail-value">{patientData.gender}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Username:</span>
        <span className="detail-value">{patientData.username}</span>
      </div>
    </div>
  );
};

export default PatientDetails;