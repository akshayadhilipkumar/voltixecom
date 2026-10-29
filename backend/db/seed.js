// ============ db/seed.js : SAMPLE PRODUCTS ============
// Server start aagum bodhu automatic ah run aagum. Manual: npm run seed
const db = require('./database');

// [name, brand, category, price in INR]
const products = [
  ['Galaxy S24', 'Samsung', 'Phones', 74999],
  ['Galaxy A55', 'Samsung', 'Phones', 39999],
  ['Galaxy M35', 'Samsung', 'Phones', 19999],
  ['iPhone 15', 'Apple', 'Phones', 69999],
  ['iPhone 14', 'Apple', 'Phones', 56999],
  ['Nord CE4', 'OnePlus', 'Phones', 24999],
  ['Redmi Note 13', 'Xiaomi', 'Phones', 16999],
  ['Pixel 8a', 'Google', 'Phones', 52999],
  ['MacBook Air M2', 'Apple', 'Laptops', 99999],
  ['Pavilion 15', 'HP', 'Laptops', 62999],
  ['IdeaPad Slim 3', 'Lenovo', 'Laptops', 44999],
  ['Vivobook 15', 'Asus', 'Laptops', 47999],
  ['Inspiron 14', 'Dell', 'Laptops', 58999],
  ['AirPods Pro 2', 'Apple', 'Audio', 24999],
  ['Buds 2 Pro', 'Samsung', 'Audio', 11999],
  ['WH-1000XM5', 'Sony', 'Audio', 29999],
  ['Rockerz 450', 'boAt', 'Audio', 1499],
  ['Airdopes 141', 'boAt', 'Audio', 1299],
  ['Watch Series 9', 'Apple', 'Watches', 41999],
  ['Galaxy Watch 6', 'Samsung', 'Watches', 24999],
  ['Fire-Boltt Ninja', 'Fire-Boltt', 'Watches', 1799],
  ['Echo Dot 5', 'Amazon', 'Smart Home', 4999],
  ['Mi Smart Band 8', 'Xiaomi', 'Watches', 2999],
  ['PS5 Slim', 'Sony', 'Gaming', 49999],
  ['Redragon Keyboard', 'Redragon', 'Gaming', 2499],
  ['Logitech G102', 'Logitech', 'Gaming', 1299],
  ['iPad 10th Gen', 'Apple', 'Tablets', 34999],
  ['Galaxy Tab S9 FE', 'Samsung', 'Tablets', 32999],
];

function seedIfEmpty() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM products').get();
  if (c > 0) return;
  const insert = db.prepare(
    `INSERT INTO products (name, brand, category, price, image, rating, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))`
  );
  db.transaction(() => {
    products.forEach(([name, brand, category, price], i) => {
      const image = `https://picsum.photos/seed/voltix${i}/400/300`; // placeholder - later real image URL podunga
      const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
      const daysAgo = `-${Math.floor(Math.random() * 60)} days`; // "New arrivals" sort ku
      insert.run(`${brand} ${name}`, brand, category, price, image, rating, daysAgo);
    });
  })();
  console.log('Seeded ' + products.length + ' products');
}

module.exports = { seedIfEmpty };
if (require.main === module) seedIfEmpty();