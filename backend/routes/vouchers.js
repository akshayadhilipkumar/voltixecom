// ============ routes/vouchers.js : LIST + CLAIM ============
const router = require('express').Router();
const db = require('../db/database');
const requireAuth = require('../middleware/auth');
router.use(requireAuth);

// GET /api/vouchers -> user oda ella vouchers
router.get('/', (req, res) => {
  res.json(db.prepare(
    'SELECT id, tier, amount, code, status FROM vouchers WHERE user_id = ? ORDER BY id DESC'
  ).all(req.userId));
});

// POST /api/vouchers/:id/claim
// status flow:  available (earned) -> claimed (user claim pannadhu) -> used (order la apply aanadhu)
router.post('/:id/claim', (req, res) => {
  const v = db.prepare('SELECT * FROM vouchers WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!v) return res.status(404).json({ error: 'Voucher not found' });
  if (v.status !== 'available') return res.status(400).json({ error: 'Already claimed or used' });
  db.prepare("UPDATE vouchers SET status = 'claimed' WHERE id = ?").run(v.id);
  res.json({ ok: true, code: v.code });
});

module.exports = router;