import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import CanteenDashboard from './pages/CanteenDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import Header from './components/Header';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {isAuthenticated && <Header />} {/* Ensures Header is always shown after login */}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/order-history" element={isAuthenticated ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/canteen-dashboard" element={isAuthenticated ? <CanteenDashboard /> : <Navigate to="/login" />} />
        <Route path="/order-confirmation/:orderId" element={isAuthenticated ? <OrderConfirmation /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
