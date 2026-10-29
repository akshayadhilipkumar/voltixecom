// ============ pages/products.js : LIST + SEARCH + SORT ============
Router.register('/products', async (app, q) => {
  const sort = q.sort || 'new';
  const search = q.search || '';
  const list = await api(`/products?sort=${encodeURIComponent(sort)}&search=${encodeURIComponent(search)}`);
  app.innerHTML = `
    <div class="toolbar">
      <h2 class="title">${search ? 'Results for “' + esc(search) + '”' : 'All products'}</h2>
      <select id="sortSel">
        <option value="new">Newest</option>
        <option value="rating">Top rated</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
    </div>
    ${list.length ? `<div class="grid">${list.map(productCard).join('')}</div>`
                  : '<div class="state">No products found. Try another search.</div>'}`;
  const sel = document.getElementById('sortSel');
  sel.value = sort;
  sel.onchange = () => (location.hash = `#/products?sort=${sel.value}&search=${encodeURIComponent(search)}`);
});