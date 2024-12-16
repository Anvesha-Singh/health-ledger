import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Login } from './Login';
import { PatientDashboard } from './PatientDashboard';
import { DoctorDashboard } from './DoctorDashboard';
import { AdminDashboard } from './AdminDashboard';
import { LogOut } from 'lucide-react';

const App = () => {
  const { user, logout } = useContext(AuthContext);

  const renderDashboard = () => {
    if (!user) return <Login />;

    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-xl font-bold">
            Blockchain Healthcare Platform
          </div>
          <div className="flex items-center space-x-4">
            <span>{user.name || user.username}</span>
            <button 
              onClick={logout} 
              className="flex items-center bg-red-500 text-white px-3 py-2 rounded"
            >
              <LogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
      {renderDashboard()}
    </div>
  );
};

export default App;