import React, { useEffect, useState, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Web3 from 'web3';
import '../styles.css';

const PatientDetails = () => {
  const [patientData, setPatientData] = useState(null);
  const [patientAddress, setPatientAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
;  const { contract } = useContext(ContractContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const currentAddress = accounts[0];
        setPatientAddress(currentAddress);

        const data = await contract.methods.patients(currentAddress).call();
        
        setPatientData({
          name: data.name || 'Not provided',
          age: data.age.toString() || 'N/A',
          gender: data.gender || 'Not specified'
        });
        
      } catch (err) {
        setError('Failed to load patient data - make sure you\'re registered');
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
    <div className="details-card" style={{ backgroundColor: '#f8f9fa', color: '#333' }}>
      <div className="detail-item">
        <span className="detail-label">Wallet Address:</span>
        <span className="detail-value mono">
          {patientAddress.substring(0, 10)}...
        </span>
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
    </div>
  );
};

export default PatientDetails;