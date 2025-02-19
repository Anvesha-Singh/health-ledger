import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './assets/logo.png';
import './styles.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:5000/users?username=${credentials.username}&password=${credentials.password}`
      );
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.length > 0) {
        const user = data[0]; 
        switch (user.role) {
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          case 'patient':
            navigate('/patient-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            setError('Invalid user role');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <div className="patient-actions">
              <button type="submit" className="all-btns">Sign in</button>
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
