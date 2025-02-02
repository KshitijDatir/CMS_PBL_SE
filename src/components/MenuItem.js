import React, { useEffect, useState } from 'react';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No token provided');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Include token in Authorization header
          }
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || 'Failed to fetch menu');
          return;
        }

        const data = await response.json();
        setMenu(data);  // Assuming the API returns an array of menu items
      } catch (err) {
        setError('Error fetching menu: ' + err.message);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      {error && <p>{error}</p>}
      <ul>
        {menu.length > 0 ? (
          menu.map(item => (
            <li key={item.id}>{item.name} - {item.price}</li>
          ))
        ) : (
          <p>No items available</p>
        )}
      </ul>
    </div>
  );
};

export default Menu;
