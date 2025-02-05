const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const app = express();
const port = 5000;
const secretKey = 'your_secret_key'; 

const users = [{ id: 1, email: 'user@example.com', password: 'password' }];

const menuItems = [
  { id: 1, name: 'Burger', description: 'Delicious Chicken burger', price: 5.99, image: '/assets/burger.jpg' },
  { id: 2, name: 'Pizza', description: 'Cheesy pizza', price: 8.99, image: '/assets/pizza.jpg' },
  { id: 3, name: 'Pasta', description: 'Creamy pasta', price: 7.99, image: '/assets/pasta.jpg' },
]

let orders = [];

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  console.log(authHeader) ;
  const token = authHeader.split(' ')[1];
  console.log(token) ;
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// 🟢 **Fetch Orders**
app.get('/api/orders',  (req, res) => {
  res.json(orders);
});

// 🟢 **Create Order**
app.post('/api/order',  (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order: No items selected' });
  }
  console.log("euu") ;
  const newOrder = {
    id: orders.length + 1,
    items,
    status: 'Pending',
  };
  orders.push(newOrder);
  res.json({ success: true, orderId: newOrder.id });
  console.log("Ikde ala") ;
  // 🔥 Notify WebSocket Clients
  broadcastMessage({ type: 'NEW_ORDER', order: newOrder });
});


// 🟢 **User Login**
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// 🟢 **Fetch Menu Items**
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// 🟢 **WebSocket for Real-Time Order Updates**
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('✅ WebSocket Connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'UPDATE_STATUS') {
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          order.status = data.status;
          broadcastMessage({ type: 'STATUS_UPDATED', order });
        }
      }
    } catch (error) {
      console.error('⚠️ WebSocket Error:', error);
    }
  });

  ws.on('close', () => {
    console.log('⚠️ WebSocket Disconnected');
  });
});

// 🟢 **Broadcast Message to All Clients**
const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Start Server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
