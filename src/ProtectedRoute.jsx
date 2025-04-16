import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';

const ProtectedRoute = ({ requiredRole, children }) => {
  const navigate = useNavigate();
  const contract = useContext(ContractContext);
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const role = await contract.methods.roles(accounts[0]).call();
        
        if (role !== requiredRole.toString()) {
          navigate('/');
          return;
        }

        // Additional registration checks
        let isValid = false;
        switch(requiredRole) {
          case 1: 
            const patient = await contract.methods.patients(accounts[0]).call();
            isValid = patient.name !== '';
            break;
          case 2:
            const doctor = await contract.methods.doctors(accounts[0]).call();
            isValid = doctor.name !== '';
            break;
          case 3:
            const hospital = await contract.methods.hospitals(accounts[0]).call();
            isValid = hospital.name !== '';
            break;
        }

        if (!isValid) navigate('/signup');

      } catch (err) {
        navigate('/');
      }
    };

    verifyAccess();
  }, [contract, navigate, requiredRole]);

  return children;
};

export default ProtectedRoute;