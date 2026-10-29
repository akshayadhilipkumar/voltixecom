// ============ middleware/auth.js : LOGIN CHECK ============
// Cart, wishlist, orders routes ku munadi idhu run aagum. Token illana 401 kudukum.
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please login first' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired, login again' });
  }
};