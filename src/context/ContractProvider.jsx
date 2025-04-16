import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ContractContext } from './ContractContext';
import AuthContract from '../contracts/Auth.json';

const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initContract = async () => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          console.error("MetaMask not detected");
          setLoading(false);
          return;
        }

        // Create Web3 instance with proper error handling
        const web3 = new Web3(window.ethereum);
        
        // Request account access explicitly
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          console.error("No accounts found. MetaMask may be locked.");
          setLoading(false);
          return;
        }
        
        console.log("Connected account:", accounts[0]);

        // Get network ID with explicit error handling
        const networkId = await web3.eth.net.getId();
        console.log("Connected to network ID:", networkId);
        
        // Verify contract deployment on this network
        if (!AuthContract.networks || !AuthContract.networks[networkId]) {
          console.error(`Contract not deployed on network ${networkId}`);
          setLoading(false);
          return;
        }

        // Initialize the contract with specific options
        const contractInstance = new web3.eth.Contract(
          AuthContract.abi,
          AuthContract.networks[networkId].address,
          {
            from: accounts[0],
            gas: 500000 // Higher gas limit for complex operations
          }
        );
        
        console.log("Contract initialized at:", AuthContract.networks[networkId].address);
        
        // Test contract connection with a simple call
        try {
          await contractInstance.methods.getRole(accounts[0]).call();
          console.log("Contract connection verified");
        } catch (callError) {
          console.error("Contract method call failed:", callError);
          setLoading(false);
          return;
        }

        setContract(contractInstance);
        setLoading(false);
      } catch (error) {
        console.error("Contract initialization failed:", error);
        setLoading(false);
      }
    };

    initContract();
  }, []);

  return (
    <ContractContext.Provider value={{ contract, loading }}>
      {loading ? <div className="loading">Loading contract...</div> : children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;