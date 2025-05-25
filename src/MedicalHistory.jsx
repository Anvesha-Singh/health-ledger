import React, { useState, useContext, useEffect } from 'react';
import { ContractContext } from './context/ContractContext';
import { pinataGateway } from './pinataConfig';
import Web3 from 'web3';
import Header from './components/Header';
import './styles.css';

const MedicalHistory = () => {
    const { contract } = useContext(ContractContext);
    const web3 = new Web3(window.ethereum);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            const count = await contract.methods.getMyFilesCount().call({ from: accounts[0] });
            const filesArray = [];
            for (let i = 0; i < count; i++) {
                const fileData = await contract.methods.getMyFileAt(i).call({ from: accounts[0] });
                filesArray.push({
                    ipfsHash: fileData[0],
                    timestamp: fileData[1],
                    fileName: fileData[2]
                });
            }
            setFiles(filesArray);
            setError('');
        } catch (err) {
            console.error("Error loading files:", err);
            setError('Failed to load your medical records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contract) loadFiles();
        // eslint-disable-next-line
    }, [contract]);

    const handleDelete = async (index) => {
        if (!window.confirm("Are you sure you want to delete this prescription?")) return;
        setDeleting(true);
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.deleteMedicalFile(index).send({ from: accounts[0] });
            await loadFiles();
        } catch (err) {
            alert("Failed to delete file: " + err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="app-container">
            <Header />
            <div className="dashboard-content">
                <h1 className="dashboard-title">Medical History</h1>
                {loading && <div className="loading">Loading your medical files...</div>}
                {error && <div className="error-message">{error}</div>}
                <div className="files-grid">
                    {files.length === 0 && !loading ? (
                        <div className="empty-state">
                            <p>No medical records found</p>
                            <small>Add prescriptions using the "Add Prescription" button</small>
                        </div>
                    ) : (
                        files.map((file, index) => (
                            <div key={index} className="file-card">
                                <h4>{file.fileName}</h4>
                                <p>Uploaded: {new Date(parseInt(file.timestamp) * 1000).toLocaleDateString()}</p>
                                <a 
                                    href={`${pinataGateway}/ipfs/${file.ipfsHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-file-btn"
                                >
                                    View File
                                </a>
                                <button
                                    className="delete-btn"
                                    style={{
                                        marginTop: "0.7em",
                                        marginLeft: "0.3em",
                                        background: "#d32f2f",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "0.5em 1em",
                                        fontWeight: 600,
                                        cursor: "pointer"
                                    }}
                                    disabled={deleting}
                                    onClick={() => handleDelete(index)}
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistory;