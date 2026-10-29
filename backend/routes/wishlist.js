// ============ routes/wishlist.js ============
const router = require('express').Router();
const db = require('../db/database');
const requireAuth = require('../middleware/auth');
router.use(requireAuth);

// GET /api/wishlist -> user oda wishlist products
router.get('/', (req, res) => {
  res.json(db.prepare(
    `SELECT p.* FROM wishlist w JOIN products p ON p.id = w.product_id WHERE w.user_id = ?`
  ).all(req.userId));
});

// POST /api/wishlist/:productId -> irundha remove, illana add (toggle)
router.post('/:productId', (req, res) => {
  const args = [req.userId, Number(req.params.productId)];
  const exists = db.prepare('SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?').get(...args);
  if (exists) {
    db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(...args);
    return res.json({ wished: false });
  }
  db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(...args);
  res.json({ wished: true });
});

module.exports = router;