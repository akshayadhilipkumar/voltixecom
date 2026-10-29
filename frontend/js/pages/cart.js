// ============ pages/cart.js ============
Router.register('/cart', async (app) => {
  if (!requireLogin()) return;
  const [items, vouchers] = await Promise.all([api('/cart'), api('/vouchers')]);
  if (!items.length) {
    app.innerHTML = '<h2 class="title">Your cart</h2><div class="state">Your cart is empty.<br><a class="btn" href="#/products">Browse products</a></div>';
    return;
  }
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const claimed = vouchers.filter((v) => v.status === 'claimed'); // claim pannadhu mattum apply panna mudiyum

  // data-action buttons ellam main.js la handle aagum
  app.innerHTML = `<h2 class="title">Your cart</h2>
    <div class="list">${items.map((i) => `
      <div class="card row-card">
        <img src="${esc(i.image)}" alt="" />
        <div class="grow"><b>${esc(i.name)}</b><br><span>${money(i.price)}</span></div>
        <div class="qty">
          <button data-action="qty" data-id="${i.product_id}" data-q="${i.quantity - 1}">−</button>
          <b>${i.quantity}</b>
          <button data-action="qty" data-id="${i.product_id}" data-q="${i.quantity + 1}">+</button>
        </div>
        <button class="btn ghost" data-action="remove" data-id="${i.product_id}">Remove</button>
      </div>`).join('')}
    </div>
    ${claimed.length ? `<div class="card row-card" style="margin-top:16px">
      <div class="grow"><b>Use a gift voucher</b><br><span class="muted">Amount will be deducted when you place the order</span></div>
      <select id="voucherSel">
        <option value="">No voucher</option>
        ${claimed.map((v) => `<option value="${v.id}">${money(v.amount)} (${esc(v.tier)})</option>`).join('')}
      </select></div>` : ''}
    <div class="card summary"><span>Total: ${money(total)}</span>
      <button class="btn" data-action="checkout">Place order</button></div>`;
});