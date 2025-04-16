import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ContractContext } from './ContractContext';
import AuthContract from '../contracts/Auth.json';

const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AuthContract.networks[networkId];
        
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            AuthContract.abi,
            deployedNetwork.address
          );
          setContract(instance);
        }
      }
    };
    initContract();
  }, []);

  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;