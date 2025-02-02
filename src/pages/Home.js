import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]); // Stores selected menu items
  const navigate = useNavigate();

  // 🟢 Fetch menu items on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/menu', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(() => alert('Error fetching menu'));
  }, [navigate]);

  // 🟢 Function to Add Item to Cart
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]); // ✅ Append new item to cart
  };

  // 🟢 Function to Remove Item from Cart
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // 🟢 Function to Place Order
  const placeOrder = () => {
    const token = localStorage.getItem('token');

    if (cart.length === 0) {
      alert('Cart is empty! Add items before placing an order.');
      return;
    }

    fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items: cart }), // ✅ Send selected items in order request
    })
      .then(res => res.json())
      .then((data) => {
        alert(`Order placed successfully! Your Order ID is: ${data.orderId}`);
        setCart([]); // ✅ Clear cart after order placement
        navigate(`/order-confirmation/${data.orderId}`); // Redirect to order confirmation page
      })
      .catch(() => alert('Error placing order'));
  };

  return (
    <div>
      <h1>Menu</h1>
      <div className="menu-container">
        {menuItems.length === 0 ? (
          <p>No menu items available.</p>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-image" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>

      {/* 🛒 Cart Section */}
      <h2>Cart</h2>
      <div className="cart-container">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.name} - ${item.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </div>
          ))
        )}
      </div>

      {/* 🟢 Place Order Button */}
      {cart.length > 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
};

export default Home;
