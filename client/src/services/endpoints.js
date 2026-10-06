import api from './api.js';

const data = (res) => res.data;

// ---------------- AUTH ----------------

export const AuthAPI = {
  register: (body) =>
    api.post('/auth/register', body).then(data),

  login: (body) =>
    api.post('/auth/login', body).then(data),

  logout: () =>
    api.post('/auth/logout').then(data),

  me: () =>
    api.get('/auth/me').then(data),
};

// ---------------- USER ----------------

export const UserAPI = {
  update: (body) =>
    api.patch('/users/me', body).then(data),

  changePassword: (body) =>
    api.patch('/users/me/password', body).then(data),
};

// ---------------- FARMER ----------------

export const FarmerAPI = {
  profile: () =>
    api.get('/farmers/me').then(data),

  updateProfile: (body) =>
    api.put('/farmers/me', body).then(data),

  dashboard: () =>
    api.get('/farmers/me/dashboard').then(data),
};

// ---------------- CATEGORY ----------------

export const CategoryAPI = {
  list: (params) =>
    api.get('/categories', { params }).then(data),
};

// ---------------- CROP INFO ----------------

export const CropInfoAPI = {
  list: (params) =>
    api.get('/crop-info', { params }).then(data),
};

// ---------------- LISTING API ----------------

const listingAPI = (base) => ({
  list: (params) =>
    api.get(base, { params }).then(data),

  mine: (params) =>
    api.get(`${base}/mine`, { params }).then(data),

  getMine: (id) =>
    api.get(`${base}/mine/${id}`).then(data),

  get: (id) =>
    api.get(`${base}/${id}`).then(data),

  create: (body) =>
    api.post(base, body).then(data),

  update: (id, body) =>
    api.put(`${base}/${id}`, body).then(data),

  patch: (id, body) =>
    api.patch(`${base}/${id}`, body).then(data),

  remove: (id) =>
    api.delete(`${base}/${id}`).then(data),
});

export const CropAPI = listingAPI('/crops');

export const ProductAPI = listingAPI('/products');

// ---------------- ORDER ----------------

export const OrderAPI = {
  create: (body) =>
    api.post('/orders', body).then(data),

  mine: () =>
    api.get('/orders/mine').then(data),

  forFarmer: () =>
    api.get('/orders/farmer').then(data),

  setStatus: (id, status, reason) =>
    api.patch(
      `/orders/${id}/status`,
      { status, reason }
    ).then(data),

  cancel: (id) =>
    api.patch(`/orders/${id}/cancel`).then(data),
};

// ---------------- UPLOAD ----------------

export const UploadAPI = {
  image: (file) => {
    const form = new FormData();
    form.append('image', file);

    return api.post('/uploads', form).then(data);
  },
};

// ---------------- WEATHER ----------------

export const WeatherAPI = {
  current: (params) =>
    api.get('/weather', { params }).then(data),
};

// ---------------- ADMIN ----------------

export const AdminAPI = {
  stats: () =>
    api.get('/admin/stats').then(data),

  reports: (params) =>
    api.get('/admin/reports', { params }).then(data),

  users: (params) =>
    api.get('/admin/users', { params }).then(data),

  setUserActive: (id, isActive) =>
    api.patch(
      `/admin/users/${id}/status`,
      { isActive }
    ).then(data),

  products: (params) =>
    api.get('/admin/products', { params }).then(data),

  disableProduct: (id, isDisabled, reason) =>
    api.patch(
      `/admin/products/${id}/disable`,
      { isDisabled, reason }
    ).then(data),

  deleteProduct: (id) =>
    api.delete(`/admin/products/${id}`).then(data),

  orders: (params) =>
    api.get('/admin/orders', { params }).then(data),
};