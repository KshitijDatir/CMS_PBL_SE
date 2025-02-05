import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo-container">
          <img src="/api/placeholder/40/40" alt="PICT Canteen Logo" className="logo" />
          <h1 className="header-title">PICT CANTEEN</h1>
        </div>
        <nav className="nav-links">
          {token && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/order-history" className="nav-link">Order History</Link>
              <Link to="/canteen-dashboard" className="nav-link">Canteen Dashboard</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
              
            </>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;