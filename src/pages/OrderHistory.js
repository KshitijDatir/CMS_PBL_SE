import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]); // Ensuring orders starts as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format'); // Ensures data is an array
        }
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching orders');
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Orders</h1>
      <div>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Items: {order.items.map((item) => item.name).join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
