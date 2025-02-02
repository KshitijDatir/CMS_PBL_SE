import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Import CSS for styling

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Ensure proper state update
  };

  return (
    <header className="header">
      <h1 className="header-title">PICT CANTEEN</h1>
      <nav className="nav-links">
        {token && <Link to="/" className="nav-link">Home</Link>}
        {token && <Link to="/order-history" className="nav-link">Order History</Link>}
        {token && <Link to="/canteen-dashboard" className="nav-link">Canteen Dashboard</Link>}
        {token ? (
          <button onClick={handleLogout} className="logout-button">Logout</button>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
