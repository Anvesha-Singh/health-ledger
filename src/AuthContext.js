import React, { useState, createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Simulated users database
    const mockUsers = {
      'patient1': { 
        username: 'patient1', 
        role: 'patient', 
        name: 'John Doe',
        id: 'P12345'
      },
      'doctor1': { 
        username: 'doctor1', 
        role: 'doctor', 
        name: 'Dr. Emily Wong',
        specialization: 'Cardiology'
      },
      'admin1': { 
        username: 'admin1', 
        role: 'admin', 
        hospitalName: 'Central Healthcare'
      }
    };

    const foundUser = mockUsers[username];
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};