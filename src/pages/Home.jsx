import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/menu', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(() => alert('Error fetching menu'));
  }, [navigate]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleAddMore = (item) => {
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      )
    );
  };

  const handleRemoveFromCart = (item) => {
    setCart(prevCart => {
      return prevCart.map(cartItem => 
        cartItem.id === item.id && cartItem.quantity >= 1 
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const placeOrder = () => {
    const token = localStorage.getItem('token');
    if (cart.length === 0) {
      alert('Cart is empty! Add items before placing an order.');
      return;
    }
    fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: cart }),
    })
      .then(res => res.json())
      .then((data) => {
        alert(`Order placed successfully! Your Order ID is: ${data.orderId}`);
        setCart([]);
        navigate(`/order-confirmation/${data.orderId}`);
      })
      .catch(() => alert('Error placing order'));
  };

  return (
    <div className="app-container">
      <header>
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
      </header>  

      <div className="menu-container">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="price">${item.price.toFixed(2)}</div>

              <div className={`add-to-cart-container ${cart.some(cartItem => cartItem.id === item.id) ? 'added' : ''}`}>
                {cart.some(cartItem => cartItem.id === item.id) ? (
                  <div className="split-button">
                    <button onClick={() => handleRemoveFromCart(item)} className="remove-from-cart">
                      -
                    </button>
                    <span>{cart.find(cartItem => cartItem.id === item.id)?.quantity}</span>
                    <button onClick={() => handleAddMore(item)} className="add-more">
                      +
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item)} className="add-to-cart">
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className={`cart-panel ${showCart ? 'open' : ''}`}>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="cart-item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={placeOrder} className="place-order-button">
                Place Order
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
