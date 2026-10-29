// ============ state.js : LOGGED-IN USER, CART COUNT, WISHLIST IDS ============
const State = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  wishIds: new Set(),
  cartCount: 0,
};

function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  State.user = user;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  State.user = null;
}

// Cart count badge + wishlist hearts + sidebar login/logout text update panna
async function refreshBadges() {
  if (State.user) {
    try {
      const [cart, wish] = await Promise.all([api('/cart'), api('/wishlist')]);
      State.cartCount = cart.reduce((s, i) => s + i.quantity, 0);
      State.wishIds = new Set(wish.map((p) => p.id));
    } catch (e) {
      if (/login|Session/i.test(e.message)) logout(); // token expire aana logout
    }
  }
  if (!State.user) { State.cartCount = 0; State.wishIds = new Set(); }
  document.getElementById('cartCount').textContent = State.cartCount;
  const link = document.getElementById('authLink');
  link.textContent = State.user ? '🚪 Logout (' + State.user.name.split(' ')[0] + ')' : '👤 Login / Sign up';
  link.dataset.action = State.user ? 'logout' : '';
}