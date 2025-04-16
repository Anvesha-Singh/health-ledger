import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import logoImg from './assets/logo.png';
import AuthContract from './contracts/Auth.json';
import './styles.css';

const Login = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  // Initialize Web3 and contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (!window.ethereum) {
          setError('MetaMask not installed');
          return;
        }

        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        
        // Check contract deployment
        if (!AuthContract.networks[networkId]) {
          setError(`Contract not deployed on network ${networkId}`);
          return;
        }

        // Initialize contract
        const contractInstance = new web3.eth.Contract(
          AuthContract.abi,
          AuthContract.networks[networkId].address
        );
        setContract(contractInstance);

        // Check existing accounts
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message);
      }
    };

    initWeb3();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!contract || loading) return;
    
    setLoading(true);
    setError('');

    try {
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const userAccount = accounts[0];
      setAccount(userAccount);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      // Get role using correct method
      const role = await contract.methods.getRole(accounts[0]).call({
        from: accounts[0],
        gas: 300000
      });
      const roleNumber = Number(role);

      // Navigation logic
      switch(roleNumber) {
        case 3: navigate('/admin-dashboard'); break;
        case 2: navigate('/doctor-dashboard'); break;
        case 1: navigate('/patient-dashboard'); break;
        default: navigate('/signup');
      }

    } catch (err) {
      console.error("Connection error:", err);
      setError(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-content">
      <div className="login-box">
        <header className="header">
          <div className="logo">
            <img src={logoImg} alt="Health Ledger Logo" />
            <h1>Health Ledger</h1>
          </div>
        </header>
        
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <input
              type="text"
              readOnly
              value={account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
              style={{ 
                backgroundColor: "#1a1a1a", 
                cursor: account ? "default" : "pointer",
                textAlign: "center",
                color: account ? "inherit" : "#757575"
              }}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="patient-actions">
            <button 
              type="submit" 
              className="all-btns" 
              disabled={!contract || loading}
            >
              {loading ? "Connecting..." : "Sign In"}
            </button>
            
            <button 
              type="button" 
              className="all-btns" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <div className="image-box"></div>
    </div>
  );
};

export default Login;