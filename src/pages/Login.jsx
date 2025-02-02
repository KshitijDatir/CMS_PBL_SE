import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = response ;
    console.log(data) ;
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/');
    } else {
      alert('Login failed: ' + data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>PICT CANTEEN</h1>
        <p className="subtitle">Please log in to continue</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
