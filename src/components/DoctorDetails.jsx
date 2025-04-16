import React, { useEffect, useState, useContext } from 'react';
import { ContractContext } from '../context/ContractContext';
import Web3 from 'web3';
import '../styles.css';

const DoctorDetails = () => {
  const [doctorData, setDoctorData] = useState(null);
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (contract) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          
          const data = await contract.methods.doctors(accounts[0]).call();
          setDoctorData({
            id: accounts[0].slice(0,8).toUpperCase(),
            name: data.name,
            specialization: data.specialization,
            hospital: data.hospital
          });
        } catch (err) {
          console.error('Error loading doctor data:', err);
        }
      }
    };
    
    loadData();
  }, [contract]);

  if (!doctorData) return <div>Loading doctor data...</div>;

  return (
    <div className="details">
      <div className="field mb-1">
        <span className="field-label">ID:</span> {doctorData.id}
      </div>
      <div className="field mb-1">
        <span className="field-label">Name:</span> {doctorData.name}
      </div>
      <div className="field mb-1">
        <span className="field-label">Specialisation:</span> {doctorData.specialization}
      </div>
      <div className="field">
        <span className="field-label">Associated Hospitals:</span> {doctorData.hospital}
      </div>
    </div>
  );
};

export default DoctorDetails;