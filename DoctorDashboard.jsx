import React, { useState } from 'react';
import Header from './components/Header';
import DoctorDetails from './components/DoctorDetails';
import PatientList from './components/PatientList';
import Modal from './Modal'; // Import the Modal component
import { pinata } from './config'; // Import Pinata configuration
import { ethers } from 'ethers'; // Import ethers.js
import './styles.css';

const DoctorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [storedHash, setStoredHash] = useState("");

  // Replace these with your deployed contract's details
  const contractAddress = "0x17e91224c30c5b0b13ba2ef1e84fe880cb902352";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_ipfsHash",
          type: "string",
        },
      ],
      name: "setIPFSHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getIPFSHash",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const handleAddPatientClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      const response = await pinata.upload.file(selectedFile);
      const ipfsHash = response.IpfsHash;
      setIpfsHash(ipfsHash);

      await storeHashOnBlockchain(ipfsHash);
      handleCloseModal(); // Close the modal after successful submission
    } catch (error) {
      console.log("File upload failed:", error);
    }
  };

  const storeHashOnBlockchain = async (hash) => {
    try {
      // Connect to Ethereum provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Send the transaction to store the IPFS hash on the blockchain
      const tx = await contract.setIPFSHash(hash);
      await tx.wait();

      console.log("IPFS hash stored on blockchain:", hash);
    } catch (error) {
      console.log("Failed to store IPFS hash on blockchain:", error);
    }
  };

  const retrieveHashFromBlockchain = async () => {
    try {
      // Connect to Ethereum provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Retrieve the IPFS hash from the blockchain
      const retrievedHash = await contract.getIPFSHash();
      setStoredHash(retrievedHash);

      console.log("Retrieved IPFS hash from blockchain:", retrievedHash);
    } catch (error) {
      console.log("Failed to retrieve IPFS hash from blockchain:", error);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      <DoctorDetails />
      <button className="add-patient-btn" onClick={handleAddPatientClick}>
        + Add Patient
      </button>
      <PatientList />

      {/* Modal for adding a patient */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="upload-section">
          <label className="form-label">Choose File</label>
          <input type="file" onChange={changeHandler} className="file-input" />
          <button onClick={handleSubmission} className="submit-button">
            Submit
          </button>
        </div>

        {ipfsHash && (
          <div className="result-section">
            <p>
              <strong>IPFS Hash:</strong> {ipfsHash}
            </p>
          </div>
        )}

        <div className="retrieve-section">
          <button onClick={retrieveHashFromBlockchain} className="retrieve-button">
            Retrieve Stored Hash
          </button>
          {storedHash && (
            <p>
              <strong>Stored IPFS Hash:</strong> {storedHash}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;