// ============ theme.js : DARK / LIGHT MODE ============
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  document.getElementById('themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
}
function initTheme() {
  applyTheme(localStorage.getItem('theme') || 'light');
  document.getElementById('themeBtn').onclick = () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}s