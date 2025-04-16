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
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  // Initialize Web3 and contract on component mount
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          console.log("MetaMask detected");
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Get and log current network ID
          const networkId = await web3Instance.eth.net.getId();
          console.log("Network ID:", networkId);
          
          // Check if contract exists on this network
          if (AuthContract.networks[networkId]) {
            const deployedAddress = AuthContract.networks[networkId].address;
            console.log("Contract address from JSON:", deployedAddress);
            
            // Create contract instance
            const contractInstance = new web3Instance.eth.Contract(
              AuthContract.abi,
              deployedAddress
            );
            setContract(contractInstance);
            console.log("Contract initialized successfully");
          } else {
            console.error("Contract not deployed on network:", networkId);
            setError(`Contract not deployed on network: ${networkId}. Check if you're connected to the right network.`);
          }
        } else {
          console.error("MetaMask not installed");
          setError("MetaMask not installed. Please install MetaMask to continue.");
        }
      } catch (err) {
        console.error("Web3 initialization error:", err);
        setError("Web3 initialization error: " + err.message);
      }
    };

    initWeb3();
  }, []);

  // Connect wallet and authenticate user
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const userAccount = accounts[0];
      setAccount(userAccount);
      console.log("Connected account:", userAccount);
      
      try {
        // Get role with explicit gas parameters
        const role = await contract.methods.roles(userAccount).call({
          from: userAccount,
          gasLimit: 3000000 // Explicit gas limit
        });
        
        // Convert the role to a number for easier comparison
        const roleNumber = parseInt(role);
        console.log('Contract role:', role, 'Role Number:', roleNumber);
        
        // Navigate based on role
        switch(roleNumber) {
          case 3: // Admin
            console.log("Navigating to admin dashboard");
            navigate('/admin-dashboard');
            break;
          case 2: // Doctor
            console.log("Navigating to doctor dashboard");
            navigate('/doctor-dashboard');
            break;
          case 1: // Patient
            console.log("Navigating to patient dashboard");
            navigate('/patient-dashboard');
            break;
          default:
            console.log("No role assigned, navigating to signup");
            navigate('/signup');
        }

      } catch (roleErr) {
        console.error("Role error:", roleErr);
        setError("Unable to determine your role. Please try again.");
      }

    } catch (err) {
      console.error("Connection error:", err);
      setError("Connection failed. Please ensure MetaMask is unlocked.");
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
            {!account ? (
              <input
                type="text"
                readOnly
                value="Connect MetaMask to login"
                style={{ 
                  backgroundColor: "#1a1a1a", 
                  cursor: "pointer",
                  textAlign: "center",
                  color: "#757575"
                }}
              />
            ) : (
              <input
                type="text"
                readOnly
                value={`${account.slice(0, 6)}...${account.slice(-4)}`}
                style={{ 
                  backgroundColor: "#1a1a1a", 
                  cursor: "default",
                  textAlign: "center" 
                }}
              />
            )}
            
            <div style={{ marginTop: "10px" }}></div>
            
            {!account && (
              <input
                type="text"
                readOnly
                value="No password needed"
                style={{ 
                  backgroundColor: "#1a1a1a", 
                  cursor: "default",
                  textAlign: "center",
                  color: "#757575"
                }}
              />
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="patient-actions">
            <button type="submit" className="all-btns" disabled={loading}>
              {loading ? "Connecting..." : (account ? "Sign in" : "Connect MetaMask")}
            </button>
            
            <button type="button" className="all-btns" onClick={() => navigate('/signup')}>
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