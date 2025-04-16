import React, { useState, useEffect, useContext } from "react";
import { ContractContext } from "../context/ContractContext";
import Web3 from 'web3';
import '../styles.css';

const PatientList = () => {
  const { contract } = useContext(ContractContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      // Get patients added by this doctor
      const patientAddresses = await contract.methods.doctorPatients(accounts[0]).call();
      
      // Get patient details
      const patientData = await Promise.all(
        patientAddresses.map(async address => {
          const data = await contract.methods.patients(address).call();
          return {
            address,
            name: data.name
          };
        })
      );
      
      setPatients(patientData);
    } catch (err) {
      console.error("Error loading patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) loadPatients();
  }, [contract]);

  if (loading) return <div>Loading patients...</div>;

  return (
    <div className="patient-list">
      {patients.length === 0 ? (
        <div className="empty-state">No patients found</div>
      ) : (
        patients.map((patient) => (
          <div key={patient.address} className="patient-card">
            <div className="patient-header">
              <h5>{patient.name}</h5>
              <span>{patient.address.slice(0, 12)}...</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientList;