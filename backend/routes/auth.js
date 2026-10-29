// ============ routes/auth.js : SIGNUP + LOGIN ============
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const makeToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register  body: { name, email, password }
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: 'Name, email and password (min 6 chars) required' });
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
    return res.status(400).json({ error: 'Email already registered' });

  // IMPORTANT: password ah NEVER plain ah save panna koodathu - hash panni than save
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, hash);
  const user = { id: info.lastInsertRowid, name, email };
  res.json({ token: makeToken(user), user });
});

// POST /api/auth/login  body: { email, password }
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email || '');
  if (!row || !bcrypt.compareSync(password || '', row.password_hash))
    return res.status(400).json({ error: 'Wrong email or password' });
  const user = { id: row.id, name: row.name, email: row.email };
  res.json({ token: makeToken(user), user });
});

module.exports = router;