import React, { useState, useContext } from 'react';
import { 
  ShieldCheck 
} from 'lucide-react';
import { AuthContext } from './AuthContext';

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    email: ''
  });

  const addDoctor = (e) => {
    e.preventDefault();
    // In real implementation, this would be a blockchain transaction
    setDoctors([...doctors, { ...newDoctor, id: `DR${doctors.length + 1}` }]);
    setNewDoctor({ name: '', specialization: '', email: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShieldCheck className="mr-3" /> Hospital Administration
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hospital Profile */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hospital Profile</h2>
          <p><strong>Name:</strong> {user.hospitalName}</p>
        </div>

        {/* Doctor Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Doctors</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Doctor Form */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
        <h2 className="text-xl font-semibold mb-4">
            Add New Doctor
        </h2>
          <form onSubmit={addDoctor}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <input 
                  type="text" 
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-2">Specialization</label>
                <input 
                  type="text" 
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Email</label>
                <input 
                  type="email" 
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <div className="col-span-2">
                <button 
                  type="submit" 
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};