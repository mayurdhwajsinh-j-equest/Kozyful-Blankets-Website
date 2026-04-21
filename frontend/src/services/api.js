import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Helper: get token from wherever it's stored ──────────────────────────────
const getToken = () => {
  // Try all common storage patterns — adjust to match your login code
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (token) return token;

  // If stored as JSON object: { token: "...", user: {...} }
  try {
    const userData = localStorage.getItem('user') || localStorage.getItem('admin');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.token || parsed.accessToken || null;
    }
  } catch {
    // not a JSON object, ignore
  }

  return null;
};

// ── Request interceptor: attach token + fix Content-Type for FormData ────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('🔑 Token being sent:', token);        // check this in console
    console.log('📦 Request headers:', config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let Axios set Content-Type automatically for FormData
    // (it needs to add the multipart boundary, don't hardcode it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token invalid or expired — clearing storage and redirecting to login.');
      // Clear all possible token keys
      ['token', 'adminToken', 'authToken', 'user', 'admin'].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      // Redirect to login (adjust path to your admin login route)
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ── Product APIs ──────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get('/products', { params: { search: query } }),
  // These accept either JSON or FormData — interceptor handles Content-Type
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── User APIs ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserOrders: () => api.get('/users/orders'),
};

// ── Order APIs ────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
};

// ── Review APIs ───────────────────────────────────────────────────────────────
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;