// ============ pages/home.js ============
Router.register('/', async (app) => {
  const [fresh, top] = await Promise.all([
    api('/products?sort=new&limit=4'),
    api('/products?sort=rating&limit=4'),
  ]);
  app.innerHTML = `
    <section class="hero">
      <h2>Smart tech, made simple.</h2>
      <p>Phones, laptops, audio and more from brands you trust.</p>
      <a class="btn" href="#/products">Shop all products</a>
    </section>
    <h2 class="title">New arrivals</h2>
    <div class="grid">${fresh.map(productCard).join('')}</div>
    <h2 class="title" style="margin-top:28px">Best sellers</h2>
    <div class="grid">${top.map(productCard).join('')}</div>`;
});