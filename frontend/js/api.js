// ============ api.js : BACKEND KU ELLA REQUESTS UM INGA THAN ============
// Page files la direct fetch() use pannama, indha api() function ah mattum use pannunga.
async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL + path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      // IMPORTANT: login token ah ellaa request layum anupurom - backend auth middleware idha paarkum
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}