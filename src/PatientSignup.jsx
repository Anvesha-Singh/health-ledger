import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './assets/logo.png';
import './styles.css';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    const passwordRules = /^.{8,}$/;
    if (!passwordRules.test(value)) {
      setPasswordError('Password should be minimum 8 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });

    if (value !== formData.password) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    // Check if any required field is empty
    const requiredFields = ['name', 'age', 'gender', 'username', 'password', 'confirmPassword'];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      setError('Please fill all required fields.');
      return; // Stop further execution if any fields are empty
    }

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: 'patient'
        })
      });

      if (response.ok) {
        setTimeout(() => navigate('/'), 2000); // Navigate after success
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <header className="header">
          <div className="logo">
            <img src={logoImg} alt="Health Ledger Logo" />
            <h1>Health Ledger</h1>
          </div>
        </header>
        <h1 className="dashboard-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Row 1: Name */}
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2: Age and Gender */}
          <div className="form-row">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Row 3: Username */}
          <div className="form-row">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row for Password and Confirm Password */}
          <div className="form-row">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
          </div>

          {passwordError && (
            <div className="password-error">
              {passwordError}
            </div>
          )}

          {error && (
            <div className="error-message" style={{ color: 'red' }}>
              {error}
            </div>
          )}

          <button type="submit" className="all-btns">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PatientSignup;
