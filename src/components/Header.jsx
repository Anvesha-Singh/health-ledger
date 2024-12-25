import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png'; // Adjust path as needed

const Header = () => {
  const navigate = useNavigate(); // Hook must be used here, at the top level of the component

  const handleLogout = () => {
    localStorage.clear(); // or sessionStorage.clear();
    navigate('/'); // Navigate to the login page
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoImg} alt="Health Ledger Logo" width="40" height="40" />
        <span>Health Ledger</span>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </button>
    </header>
  );
};

export default Header;
