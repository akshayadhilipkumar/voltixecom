// ============ server.js : BACKEND START POINT ============
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { seedIfEmpty } = require('./db/seed');

const app = express();

// IMPORTANT: CORS - frontend (Netlify) la irundhu backend ku request anupa idhu venum
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

seedIfEmpty(); // products table empty na sample products add aagum
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api', (req, res) => {
  res.send('Voltix API is working');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/vouchers', require('./routes/vouchers'));

// Error handler - ethavathu crash aana JSON error anupum
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Voltix API running on port ' + PORT));