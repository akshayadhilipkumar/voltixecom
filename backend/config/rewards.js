// ============ config/rewards.js : LOYALTY LIMITS ============
// IMPORTANT: Limits maathanum na inga mattum maathunga.
// orders: 11 => 11th order place pannum bodhu voucher varum
const MILESTONES = [
  { orders: 11, tier: 'Bronze', amount: 1000 },
  { orders: 21, tier: 'Silver', amount: 2000 },
];

// Order count vechi badge: 11+ => Bronze, 21+ => Silver, athukku keela => null
function badgeFor(orderCount) {
  let badge = null;
  for (const m of MILESTONES) if (orderCount >= m.orders) badge = m.tier;
  return badge;
}

module.exports = { MILESTONES, badgeFor };