// ============ routes/cart.js ============
const router = require('express').Router();
const db = require('../db/database');
const requireAuth = require('../middleware/auth');
router.use(requireAuth);

// GET /api/cart
router.get('/', (req, res) => {
  res.json(db.prepare(
    `SELECT c.product_id, c.quantity, p.name, p.brand, p.price, p.image
     FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?`
  ).all(req.userId));
});

// POST /api/cart  body: { product_id, quantity }  -> already irundha quantity add aagum
router.post('/', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(product_id))
    return res.status(404).json({ error: 'Product not found' });
  db.prepare(
    `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)
     ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity`
  ).run(req.userId, product_id, quantity);
  res.json({ ok: true });
});

// PUT /api/cart/:productId  body: { quantity }  (0 or less = remove)
router.put('/:productId', (req, res) => {
  const q = Number(req.body.quantity);
  if (q < 1) db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?').run(req.userId, req.params.productId);
  else db.prepare('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?').run(q, req.userId, req.params.productId);
  res.json({ ok: true });
});

router.delete('/:productId', (req, res) => {
  db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?').run(req.userId, req.params.productId);
  res.json({ ok: true });
});

module.exports = router;