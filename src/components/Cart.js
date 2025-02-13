import React from 'react';

const Cart = ({ cart, placeOrder, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <p>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</p>
          <button onClick={() => removeFromCart(item)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;
