// ============ ui.js : SMALL HELPERS (ella pages um use pannum) ============
// IMPORTANT: esc() - user type panna text ah HTML la podum bodhu idhu thaan XSS attack ah thadukkum
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '₹' + Number(n).toLocaleString('en-IN');

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// Oru product card - Home, Products, Wishlist 3 pages layum idhe use aagum
function productCard(p) {
  const on = State.wishIds.has(p.id) ? 'on' : '';
  return `
  <article class="card product">
    <button class="heart ${on}" data-action="wish" data-id="${p.id}" title="Wishlist">💜</button>
    <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />
    <span class="brand-name">${esc(p.brand)} · ⭐ ${p.rating}</span>
    <span class="name">${esc(p.name)}</span>
    <div class="row">
      <span class="price">${money(p.price)}</span>
      <button class="btn" data-action="add-cart" data-id="${p.id}">Add</button>
    </div>
  </article>`;
}

function requireLogin() {
  if (State.user) return true;
  toast('Please login first');
  location.hash = '#/login';
  return false;
}