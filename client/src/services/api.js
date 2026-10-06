import axios from 'axios';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');
export const TOKEN_KEY = 'Farmer_token';

const api = axios.create({ baseURL: BASE, timeout: 20000 });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLogin = err.config?.url?.includes('/auth/login');
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && !isLogin) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('Farmer:logout'));
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => {
  const d = e.response?.data;
  if (d?.errors?.length) return d.errors.map((x) => x.message).join('. ');
  if (d?.message) return d.message;
  if (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED') return 'Cannot reach the server. Check your connection and try again.';
  return e.message || 'Something went wrong';
};

// Uploaded image paths are relative to the API host.
export const imgUrl = (u) => (!u ? '' : /^(https?:|data:)/.test(u) ? u : `${BASE.replace(/\/api$/, '')}${u}`);

export default api;