import React, { useState, useContext } from 'react';
import { 
    User 
} from 'lucide-react';
import { AuthContext } from './AuthContext';

export const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const mockPatients = [
    { id: 'P12345', name: 'John Doe', lastVisit: '2023-12-01' },
    { id: 'P67890', name: 'Jane Smith', lastVisit: '2023-11-15' }
  ];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const addMedicalRecord = (record) => {
    // In real implementation, this would be a blockchain transaction
    console.log('Adding medical record:', record);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <User className="mr-3" /> Doctor Dashboard
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Doctor Profile */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Specialization:</strong> {user.specialization}</p>
        </div>

        {/* Patient List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Patients</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Patient ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Last Visit</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.lastVisit}</td>
                  <td>
                    <button 
                      onClick={() => handlePatientSelect(patient)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patient Medical Record Entry */}
        {selectedPatient && (
          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Medical Record for {selectedPatient.name}
            </h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const record = {
                  patientId: selectedPatient.id,
                  date: formData.get('date'),
                  diagnosis: formData.get('diagnosis'),
                  prescription: formData.get('prescription')
                };
                addMedicalRecord(record);
              }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-2">Diagnosis</label>
                  <input 
                    type="text" 
                    name="diagnosis" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">Prescription</label>
                  <textarea 
                    name="prescription" 
                    className="w-full p-2 border rounded" 
                    rows="4"
                  />
                </div>
                <div className="col-span-2">
                  <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white p-2 rounded"
                  >
                    Add Medical Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};