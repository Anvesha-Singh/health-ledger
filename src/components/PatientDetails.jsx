import React, { useEffect, useState, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Web3 from 'web3';
import '../styles.css';

const PatientDetails = () => {
  const [patientData, setPatientData] = useState(null);
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (contract) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          
          const data = await contract.methods.patients(accounts[0]).call();
          setPatientData({
            id: accounts[0].slice(0,8).toUpperCase(),
            name: data.name,
            age: data.age.toString(),
            gender: data.gender
          });
        } catch (err) {
          console.error('Error loading patient data:', err);
        }
      }
    };
    
    loadData();
  }, [contract]);

  if (!patientData) return <div>Loading patient data...</div>;

  return (
    <div className="details">
      <div className="field mb-1">
        <span className="field-label">ID:</span> {patientData.id}
      </div>
      <div className="field mb-1">
        <span className="field-label">Name:</span> {patientData.name}
      </div>
      <div className="field mb-1">
        <span className="field-label">Age:</span> {patientData.age}
      </div>
      <div className="field">
        <span className="field-label">Gender:</span> {patientData.gender}
      </div>
    </div>
  );
};

export default PatientDetails;