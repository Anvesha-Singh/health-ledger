import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';

const ProtectedRoute = ({ requiredRole, children }) => {
  const navigate = useNavigate();
  const { contract } = useContext(ContractContext);
  const [loading, setLoading] = useState(true);
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          navigate('/');
          return;
        }

        const role = await contract.methods.getRole(accounts[0]).call({
          from: accounts[0],
          gas: 300000
        });

        console.log('Role verification success:', role);
        
        if (Number(role) !== requiredRole) {
          console.log('Role mismatch, redirecting');
          navigate('/');
          return;
        }

        setLoading(false);

      } catch (err) {
        console.error('Access verification error:', err);
        navigate('/');
      }
    };

    if (contract) verifyAccess();
    return () => { isMounted = false };
  }, [contract, navigate, requiredRole]);

  if (loading) return <div className="p-4 text-center">Verifying permissions...</div>;
  return children;
};

export default ProtectedRoute;