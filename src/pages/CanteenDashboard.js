import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const CanteenDashboard = () => {
  const [orders, setOrders] = useState([]); 
  const [ws, setWs] = useState(null);

  // 🟢 Fetch orders when component loads
  useEffect(() => {
    fetchOrders();
    connectWebSocket();
  }, []);

  // 🟢 Fetch Orders from Backend
  const fetchOrders = () => {
    axios.get('http://localhost:5000/api/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  };

  // 🟢 Connect WebSocket for Live Updates
  const connectWebSocket = () => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => console.log('✅ WebSocket Connected to CanteenDashboard');
    websocket.onerror = (error) => console.error('❌ WebSocket Error:', error);
    websocket.onclose = () => {
      console.log('⚠️ WebSocket Disconnected. Attempting Reconnection...');
      setTimeout(connectWebSocket, 3000); // Try reconnecting after 3 seconds
    };

    // 🟢 Listen for WebSocket Messages (Order Updates)
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 Received WebSocket message:', data);

      if (data.type === 'STATUS_UPDATED') {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === data.order.id ? data.order : order
          )
        );
      } else if (data.type === 'NEW_ORDER') {
        fetchOrders(); // Refresh orders when a new one is added
      }
    };
  };

  // 🟢 Update Order Status
  const updateOrderStatus = (orderId, status) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_STATUS', orderId, status }));
      console.log(`📤 Sent status update: Order ${orderId} -> ${status}`);
      setTimeout(fetchOrders, 1000); // Fetch updated orders after a short delay
    } else {
      console.error('⚠️ WebSocket is not connected. Cannot update status.');
    }
  };

  return (
    <div>
      <div className="dashboard">
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders available</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-item">
                <h3>Order #{order.id}</h3>
                <div className={`status-badge ${order.status}`}>{order.status}</div>
                <p>Items: {order.items.map((item) => item.name).join(', ')}</p>
                <button onClick={() => updateOrderStatus(order.id, 'Preparing')}>
                  Mark as Preparing
                </button>
                <button onClick={() => updateOrderStatus(order.id, 'Ready')}>
                  Mark as Ready
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
