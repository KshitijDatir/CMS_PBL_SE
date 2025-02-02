import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]); // Stores selected menu items
  const [showCart, setShowCart] = useState(false); // Toggle for cart sidebar
  const navigate = useNavigate();

  // Fetch menu items on component load
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

  // Function to add item to cart
  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  // Function to remove item from cart
  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  // Function to place order
  const placeOrder = () => {
    const token = localStorage.getItem('token');
    if (cart.length === 0) {
      alert('Cart is empty! Add items before placing an order.');
      return;
    }
    fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items: cart }),
    })
      .then(res => res.json())
      .then((data) => {
        alert(`Order placed successfully! Your Order ID is: ${data.orderId}`);
        setCart([]); // Clear cart after order placement
        navigate(`/order-confirmation/${data.orderId}`);
      })
      .catch(() => alert('Error placing order'));
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Menu</h1>
        <button className="cart-toggle-button" onClick={() => setShowCart(!showCart)}>
          Cart ({cart.length})
        </button>
      </header>

      <div className="menu-container">
        {menuItems.length === 0 ? (
          <p>No menu items available.</p>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="menu-image-container">
                <img src={item.image} alt={item.name} className="menu-image" />
                <div className="item-overlay">
                  <p>{item.description}</p>
                </div>
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="price">${item.price}</p>
                <button onClick={() => addToCart(item)} className="add-to-cart-button">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Panel that now appears below the header */}
      <div className={`cart-panel ${showCart ? 'open' : ''}`}>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              <div>
                <span>{item.name}</span> - <span>${item.price.toFixed(2)}</span>
              </div>
              <button onClick={() => removeFromCart(index)} className="remove-button">
                Remove
              </button>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <button onClick={placeOrder} className="place-order-button">
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
