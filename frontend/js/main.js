// ============ main.js : APP START + ELLA BUTTON CLICKS ============
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || !el.dataset.action) return;
  const id = Number(el.dataset.id);
  const action = el.dataset.action;

  try {
    if (action === 'logout') {
      e.preventDefault();
      logout(); await refreshBadges(); toast('Logged out');
      location.hash = '#/'; Router.render();
      return;
    }
    if (!requireLogin()) return;

    if (action === 'add-cart') {
      await api('/cart', { method: 'POST', body: { product_id: id, quantity: 1 } });
      await refreshBadges(); toast('Added to cart');
    }
    if (action === 'wish') {
      const { wished } = await api('/wishlist/' + id, { method: 'POST' });
      el.classList.toggle('on', wished);
      await refreshBadges();
      toast(wished ? 'Saved to wishlist' : 'Removed from wishlist');
      if (location.hash.startsWith('#/wishlist')) Router.render();
    }
    if (action === 'qty') {
      await api('/cart/' + id, { method: 'PUT', body: { quantity: Number(el.dataset.q) } });
      await refreshBadges(); Router.render();
    }
    if (action === 'remove') {
      await api('/cart/' + id, { method: 'DELETE' });
      await refreshBadges(); Router.render();
    }
    // voucher claim
    if (action === 'claim') {
      await api('/vouchers/' + id + '/claim', { method: 'POST' });
      toast('Voucher claimed. Use it at checkout.');
      Router.render();
    }
    if (action === 'checkout') {
      // cart page la voucher select pannirundha adhoda id anupurom
      const sel = document.getElementById('voucherSel');
      const voucher_id = sel && sel.value ? Number(sel.value) : undefined;
      const result = await api('/orders', { method: 'POST', body: { voucher_id } });
      await refreshBadges();
      if (result.reward) {
        // IMPORTANT: 11th / 21st order la voucher vandha profile page ku anupurom
        toast('🎉 You earned a ' + money(result.reward.amount) + ' voucher! Claim it here.');
        location.hash = '#/profile';
      } else {
        toast('Order placed');
        location.hash = '#/orders';
      }
    }
  } catch (err) { toast(err.message); }
});

// Search bar: Enter press panna products page ku poiduvom
document.getElementById('searchForm').onsubmit = (e) => {
  e.preventDefault();
  const v = document.getElementById('searchInput').value.trim();
  location.hash = '#/products?search=' + encodeURIComponent(v);
};

// START
initTheme();
refreshBadges().then(() => Router.render());