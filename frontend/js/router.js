// ============ router.js : #/ URLS -> PAGES ============
// "#/products?sort=new" -> path = /products, query = { sort: 'new' }
const Router = {
  routes: {},
  register(path, renderFn) { this.routes[path] = renderFn; },

  async render() {
    const [path, qs] = (location.hash.slice(1) || '/').split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));
    const app = document.getElementById('app');
    const page = this.routes[path] || this.routes['/'];

    document.querySelectorAll('.sidebar nav a').forEach((a) =>
      a.classList.toggle('active', a.dataset.route === path));
    app.innerHTML = '<div class="state">Loading…</div>';

    try {
      await page(app, query);
    } catch (e) {
      // IMPORTANT: backend down aana unga site la paathuchu "Request failed" madhiri - inga handle panrom
      app.innerHTML = `<div class="state"><div class="big">⚠️</div>
        <p>${esc(e.message === 'Failed to fetch' ? 'Request failed' : e.message)}</p>
        <button class="btn" id="retry">Retry</button></div>`;
      document.getElementById('retry').onclick = () => Router.render();
    }
  },
};
window.addEventListener('hashchange', () => Router.render());