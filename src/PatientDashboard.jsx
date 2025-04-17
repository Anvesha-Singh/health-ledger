import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractContext } from './context/ContractContext';
import { pinata, uploadToPinata, pinataGateway } from './pinataConfig';
import Web3 from 'web3';
import Header from './components/Header';
import PatientDetails from './components/PatientDetails';
import './styles.css';

const PatientDashboard = () => {
    const { contract } = useContext(ContractContext);
    const navigate = useNavigate();
    const web3 = new Web3(window.ethereum);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.png,.jpeg,.doc,.docx';
        
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setLoading(true);
            setError('');
            
            try {
                // Upload to Pinata
                const ipfsHash = await uploadToPinata(file);
                if (!ipfsHash) throw new Error("File upload failed");
                
                // Store on blockchain
                const accounts = await web3.eth.getAccounts();
                await contract.methods.addMedicalFile(ipfsHash, file.name)
                    .send({ from: accounts[0] });
                
                alert("Prescription added successfully!");
            } catch (err) {
                console.error('Upload error:', err);
                setError(err.message);
                alert(`Upload failed: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fileInput.click();
    };

    const viewHistory = () => {
        navigate('/medical-history');
    };

    return (
        <div className="app-container">
            <Header />
            <h1 className="dashboard-title">Patient Dashboard</h1>
            <PatientDetails />
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="patient-actions">
                <button 
                    className="all-btns" 
                    onClick={viewHistory}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'View History'}
                </button>
                
                <button 
                    className="all-btns"
                    onClick={handleFileUpload}
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Add Prescription'}
                </button>

                <button 
                    className="all-btns"
                    onClick={() => navigate('/book-appointment')}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default PatientDashboard;