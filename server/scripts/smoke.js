// End-to-end API check. Usage: BASE_URL=http://localhost:5000 npm run smoke
// Requires the server running, `npm run seed` done, and ADMIN_EMAIL/ADMIN_PASSWORD in env or .env.
import 'dotenv/config';

const BASE = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
let passed = 0;
let failed = 0;

const call = async (method, path, body, token) => {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try { json = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, json };
};
const check = (name, ok, extra = '') => {
  ok ? passed++ : failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  ${extra}`}`);
};

const stamp = Date.now();
const pw = 'Passw0rdTest';
const farmerEmail = `farmer_${stamp}@test.dev`;
const buyerEmail = `buyer_${stamp}@test.dev`;

let r = await call('GET', '/health');
check('health', r.status === 200);

r = await call('POST', '/auth/register', { name: 'Test Farmer', email: farmerEmail, password: pw, role: 'farmer', mobile: '9876543210' });
check('register farmer', r.status === 201 && r.json.token, JSON.stringify(r.json));
const farmerToken = r.json.token;
r = await call('POST', '/auth/register', { name: 'Test Buyer', email: buyerEmail, password: pw, role: 'buyer' });
check('register buyer', r.status === 201 && r.json.token);
r = await call('POST', '/auth/register', { name: 'Hacker', email: `a_${stamp}@test.dev`, password: pw, role: 'admin' });
check('cannot self-register as admin', r.status === 400);
r = await call('POST', '/auth/register', { name: 'Dup', email: farmerEmail, password: pw, role: 'buyer' });
check('duplicate email rejected', r.status === 409);
r = await call('POST', '/auth/register', { name: 'Weak', email: `w_${stamp}@test.dev`, password: 'short', role: 'buyer' });
check('weak password rejected', r.status === 400);

r = await call('POST', '/auth/login', { email: farmerEmail, password: 'wrong-pass1' });
check('login wrong password = 401', r.status === 401);
r = await call('POST', '/auth/login', { email: buyerEmail, password: pw });
check('login buyer', r.status === 200 && r.json.token);
const buyerToken = r.json.token;

r = await call('GET', '/auth/me');
check('protected route without token = 401', r.status === 401);
r = await call('GET', '/auth/me', null, 'not.a.token');
check('invalid JWT = 401', r.status === 401);
r = await call('GET', '/auth/me', null, farmerToken);
check('valid JWT returns user', r.status === 200 && r.json.user?.email === farmerEmail);

r = await call('GET', '/admin/stats', null, farmerToken);
check('farmer blocked from admin = 403', r.status === 403);
r = await call('GET', '/orders/farmer', null, buyerToken);
check('buyer blocked from farmer orders = 403', r.status === 403);

r = await call('PUT', '/farmers/me', { village: 'Rampur', district: 'Pune', state: 'Maharashtra', farmSizeAcres: 4, cropsGrown: ['Onion'] }, farmerToken);
check('farmer profile update', r.status === 200 && r.json.data?.district === 'Pune', JSON.stringify(r.json));

r = await call('GET', '/categories');
const category = r.json.data?.[0]?._id;
check('categories seeded', r.status === 200 && !!category, 'run `npm run seed` first');

const productBody = { name: 'Fresh Onions', category, price: 22, quantity: 100, unit: 'kg', location: 'Pune, Maharashtra', description: 'Test lot', images: [], available: true };
r = await call('POST', '/products', productBody, buyerToken);
check('buyer cannot create product = 403', r.status === 403);
r = await call('POST', '/products', { ...productBody, price: -5 }, farmerToken);
check('invalid product rejected = 400', r.status === 400);
r = await call('POST', '/products', productBody, farmerToken);
check('create product', r.status === 201, JSON.stringify(r.json));
const productId = r.json.data?._id;
r = await call('PUT', `/products/${productId}`, { price: 25 }, farmerToken);
check('update product', r.status === 200 && r.json.data?.price === 25);
r = await call('GET', '/products?search=onion&available=true&minPrice=10&maxPrice=50');
check('search/filter products', r.status === 200 && r.json.data?.some((p) => p._id === productId));

r = await call('POST', '/crops', { name: 'Onion', category, quantity: 500, unit: 'kg', expectedPrice: 20, location: 'Pune', harvestDate: '2026-12-01', description: '', images: [], available: true }, farmerToken);
check('create crop', r.status === 201, JSON.stringify(r.json));
const cropId = r.json.data?._id;
r = await call('GET', '/crops/mine', null, farmerToken);
check('list my crops', r.status === 200 && r.json.data?.length === 1);
r = await call('DELETE', `/crops/${cropId}`, null, farmerToken);
check('delete crop', r.status === 200);

const address = { fullName: 'Test Buyer', mobile: '9123456780', address: '12 Market Road', district: 'Pune', state: 'Maharashtra', pincode: '411001' };
r = await call('POST', '/orders', { items: [{ product: productId, quantity: 1000 }], shippingAddress: address }, buyerToken);
check('order over stock rejected = 400', r.status === 400);
r = await call('POST', '/orders', { items: [{ product: productId, quantity: 10 }], shippingAddress: address }, buyerToken);
check('place order', r.status === 201 && r.json.data?.[0]?.status === 'pending', JSON.stringify(r.json));
const orderId = r.json.data?.[0]?._id;
r = await call('GET', `/products/${productId}`);
check('stock reduced after order', r.json.data?.quantity === 90);

r = await call('GET', '/orders/farmer', null, farmerToken);
check('farmer sees order', r.status === 200 && r.json.data?.some((o) => o._id === orderId));
r = await call('PATCH', `/orders/${orderId}/status`, { status: 'delivered' }, farmerToken);
check('invalid status jump rejected', r.status === 400);
r = await call('PATCH', `/orders/${orderId}/status`, { status: 'confirmed' }, farmerToken);
check('farmer accepts order', r.status === 200 && r.json.data?.status === 'confirmed');
r = await call('PATCH', `/orders/${orderId}/cancel`, {}, buyerToken);
check('buyer cannot cancel after confirmation = 400', r.status === 400);
for (const status of ['processing', 'shipped', 'delivered']) {
  r = await call('PATCH', `/orders/${orderId}/status`, { status }, farmerToken);
  check(`status -> ${status}`, r.status === 200);
}
r = await call('GET', '/farmers/me/dashboard', null, farmerToken);
check('farmer dashboard revenue', r.status === 200 && r.json.data?.revenue === 250, JSON.stringify(r.json.data));

r = await call('POST', '/orders', { items: [{ product: productId, quantity: 5 }], shippingAddress: address }, buyerToken);
const order2 = r.json.data?.[0]?._id;
r = await call('PATCH', `/orders/${order2}/cancel`, {}, buyerToken);
check('buyer cancels pending order', r.status === 200 && r.json.data?.status === 'cancelled');
r = await call('GET', `/products/${productId}`);
check('stock restored after cancel', r.json.data?.quantity === 90);

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  r = await call('POST', '/auth/login', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  check('admin login', r.status === 200 && r.json.user?.role === 'admin');
  const adminToken = r.json.token;
  r = await call('GET', '/admin/stats', null, adminToken);
  check('admin stats', r.status === 200 && r.json.data?.farmers >= 1);
  r = await call('PATCH', `/admin/products/${productId}/disable`, { isDisabled: true, reason: 'smoke test' }, adminToken);
  check('admin disables listing', r.status === 200);
  r = await call('GET', `/products/${productId}`);
  check('disabled listing hidden from public = 404', r.status === 404);
} else {
  console.log('SKIP  admin checks (set ADMIN_EMAIL and ADMIN_PASSWORD)');
}

r = await call('GET', '/weather?city=Pune', null, buyerToken);
check(`weather (${r.status === 503 ? 'not configured: set WEATHER_API_KEY' : r.status})`, r.status === 200 || r.status === 503, JSON.stringify(r.json));
r = await call('GET', '/does-not-exist');
check('unknown route = 404 JSON', r.status === 404 && r.json.success === false);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
