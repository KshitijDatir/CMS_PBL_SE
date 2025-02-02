import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState('Pending');

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrderStatus(data.status))
      .catch(() => alert('Error fetching order'));

    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATUS_UPDATED' && data.order.id === parseInt(orderId)) {
        setOrderStatus(data.order.status);
      }
    };

    return () => ws.close();
  }, [orderId]);

  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: {orderId}</p>
      <p>Status: {orderStatus}</p>
    </div>
  );
};

export default OrderConfirmation;
