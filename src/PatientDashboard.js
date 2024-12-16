import React, { useState, useContext } from 'react';
import { 
  User, 
  Upload, 
  MessageCircleQuestion 
} from 'lucide-react';
import { AuthContext } from './AuthContext';

export const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleDocumentUpload = (event) => {
    const newDocuments = Array.from(event.target.files).map(file => ({
      name: file.name,
      type: file.type,
      uploadDate: new Date().toLocaleDateString()
    }));
    setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <User className="mr-3" /> Patient Dashboard
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <p><strong>Patient ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
        </div>

        {/* Medical Records */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Doctor</th>
                <th className="p-2 text-left">Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.doctor}</td>
                  <td>{record.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Document Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" /> Upload Medical Documents
          </h2>
          <input 
            type="file" 
            multiple 
            onChange={handleDocumentUpload}
            className="w-full p-2 border rounded"
          />
          {uploadedDocuments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Uploaded Documents:</h3>
              <ul>
                {uploadedDocuments.map((doc, index) => (
                  <li key={index} className="flex justify-between p-2 bg-gray-100 rounded mb-2">
                    <span>{doc.name}</span>
                    <span className="text-sm text-gray-500">{doc.uploadDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Health Assistant */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageCircleQuestion className="mr-2" /> AI Health Assistant
          </h2>
          <textarea 
            placeholder="Describe your symptoms..."
            className="w-full p-2 border rounded mb-4"
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Analyze Symptoms
          </button>
        </div>
      </div>
    </div>
  );
};