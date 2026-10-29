// ============ pages/wishlist.js ============
Router.register('/wishlist', async (app) => {
  if (!requireLogin()) return;
  const list = await api('/wishlist');
  app.innerHTML = `<h2 class="title">Your wishlist</h2>` +
    (list.length ? `<div class="grid">${list.map(productCard).join('')}</div>`
                 : '<div class="state">Nothing saved yet. Tap 💜 on a product to save it.</div>');
});