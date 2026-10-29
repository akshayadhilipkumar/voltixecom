// ============ routes/products.js ============
const router = require('express').Router();
const db = require('../db/database');

// GET /api/products?search=samsung&sort=new|rating|price_asc|price_desc&limit=8
router.get('/', (req, res) => {
  const { search = '', sort = 'new', limit } = req.query;
  // IMPORTANT: ORDER BY ku user text direct ah podakoodathu (SQL injection). Adhanaala map use panrom.
  const orderMap = {
    new: 'created_at DESC',
    rating: 'rating DESC',
    price_asc: 'price ASC',
    price_desc: 'price DESC',
  };
  const like = `%${search}%`;
  let sql = `SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? OR category LIKE ?
             ORDER BY ${orderMap[sort] || orderMap.new}`;
  const params = [like, like, like];
  if (Number(limit) > 0) { sql += ' LIMIT ?'; params.push(Number(limit)); }
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

module.exports = router;