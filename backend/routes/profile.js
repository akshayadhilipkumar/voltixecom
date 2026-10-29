// ============ routes/profile.js : USER PROFILE + BADGE ============
const router = require('express').Router();
const db = require('../db/database');
const requireAuth = require('../middleware/auth');
const { MILESTONES, badgeFor } = require('../config/rewards');
router.use(requireAuth);

// GET /api/profile
router.get('/', (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId);
  const { c: orderCount } = db.prepare('SELECT COUNT(*) AS c FROM orders WHERE user_id = ?').get(req.userId);
  const vouchers = db.prepare(
    'SELECT id, tier, amount, code, status FROM vouchers WHERE user_id = ? ORDER BY id DESC'
  ).all(req.userId);

  // Adutha reward ku innum ethana orders venum
  const next = MILESTONES.find((m) => m.orders > orderCount);
  res.json({
    user,
    order_count: orderCount,
    badge: badgeFor(orderCount),
    next: next ? { tier: next.tier, amount: next.amount, orders_left: next.orders - orderCount } : null,
    vouchers,
  });
});

module.exports = router;