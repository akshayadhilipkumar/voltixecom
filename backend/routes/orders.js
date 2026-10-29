// ============ routes/orders.js ============
const router = require('express').Router();
const db = require('../db/database');
const requireAuth = require('../middleware/auth');
const { MILESTONES } = require('../config/rewards');
router.use(requireAuth);

// GET /api/orders -> orders + each order oda items
router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.userId);
  const itemsStmt = db.prepare(
    `SELECT oi.quantity, oi.price, p.name, p.image
     FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`
  );
  res.json(orders.map((o) => ({ ...o, items: itemsStmt.all(o.id) })));
});

// POST /api/orders  body: { voucher_id }  (voucher_id optional)
router.post('/', (req, res) => {
  const items = db.prepare(
    `SELECT c.product_id, c.quantity, p.price FROM cart c
     JOIN products p ON p.id = c.product_id WHERE c.user_id = ?`
  ).all(req.userId);
  if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  // IMPORTANT: total ah backend la than calculate pannanum. Frontend total ah nambakoodathu.
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Voucher apply panna: "claimed" status la irukkanum, user ku sondhama irukkanum
  let voucher = null;
  if (req.body.voucher_id) {
    voucher = db.prepare("SELECT * FROM vouchers WHERE id = ? AND user_id = ? AND status = 'claimed'")
      .get(req.body.voucher_id, req.userId);
    if (!voucher) return res.status(400).json({ error: 'Voucher not available' });
  }
  const discount = voucher ? Math.min(voucher.amount, subtotal) : 0; // total ku mela discount aagakoodathu
  const total = subtotal - discount;
  const delivery = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10); // 5 days later

  // Transaction: edhavathu fail aana ellame rollback aagum
  const placeOrder = db.transaction(() => {
    const info = db.prepare(
      `INSERT INTO orders (user_id, total, discount, status, delivery_date) VALUES (?, ?, ?, 'Placed', ?)`
    ).run(req.userId, total, discount, delivery);
    const ins = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    items.forEach((i) => ins.run(info.lastInsertRowid, i.product_id, i.quantity, i.price));
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.userId);

    if (voucher) db.prepare("UPDATE vouchers SET status = 'used' WHERE id = ?").run(voucher.id);

    // IMPORTANT: REWARD LOGIC - ippo user ku evlo orders aachu nu count panrom
    const { c: orderCount } = db.prepare('SELECT COUNT(*) AS c FROM orders WHERE user_id = ?').get(req.userId);
    const milestone = MILESTONES.find((m) => m.orders === orderCount); // 11 or 21 na match aagum
    let reward = null;
    if (milestone) {
      const code = 'VLTX-' + milestone.tier.slice(0, 3).toUpperCase() + '-' +
        Math.random().toString(36).slice(2, 8).toUpperCase();
      db.prepare('INSERT INTO vouchers (user_id, tier, amount, code) VALUES (?, ?, ?, ?)')
        .run(req.userId, milestone.tier, milestone.amount, code);
      reward = { tier: milestone.tier, amount: milestone.amount };
    }
    return { orderId: info.lastInsertRowid, reward };
  });

  const { orderId, reward } = placeOrder();
  res.json({ ok: true, order_id: orderId, reward }); // reward null na voucher illa
});

module.exports = router;