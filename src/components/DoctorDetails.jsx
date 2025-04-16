import React, { useEffect, useState, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Web3 from 'web3';
import '../styles.css';

const DoctorDetails = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { contract } = useContext(ContractContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        const data = await contract.methods.doctors(accounts[0]).call();
        
        if (data.name === '') {
          throw new Error('Doctor profile not found');
        }

        setDoctorData({
          address: accounts[0],
          name: data.name,
          specialization: data.specialization,
          hospital: data.hospital
        });
        
      } catch (err) {
        setError('Failed to load doctor data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contract) loadData();
  }, [contract]);

  if (loading) return <div className="loading">Loading doctor profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="details-card">
      <div className="detail-item">
        <span className="detail-label">Wallet Address:</span>
        <span className="detail-value mono">{doctorData.address}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Name:</span>
        <span className="detail-value">{doctorData.name}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Specialization:</span>
        <span className="detail-value">{doctorData.specialization}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Hospital:</span>
        <span className="detail-value highlight">{doctorData.hospital}</span>
      </div>
    </div>
  );
};

export default DoctorDetails;