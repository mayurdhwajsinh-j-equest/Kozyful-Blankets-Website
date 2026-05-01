import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "http://localhost:5000/api";

export const BACKEND_URL = API_BASE_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const getToken = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token");

  if (token) return token;

  try {
    const stored =
      localStorage.getItem("user") || localStorage.getItem("admin");

    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token || parsed.accessToken || null;
    }
  } catch { }

  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ["token", "adminToken", "authToken", "user", "admin"].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get("/products", { params: { search: query } }),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  patch: (id, data) => api.patch(`/products/${id}`, data),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile/me"),

  updateProfile: (data) =>
    api.put(
      `/users/${JSON.parse(localStorage.getItem("user"))?.id}`,
      data
    ),

  deleteAccount: (id) => api.delete(`/users/${id}`),

  getUserOrders: () => api.get("/users/orders"),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders"),  // ← was "/users/orders"
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getAll: () => api.get("/orders/admin/all"),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const reviewAPI = {
  create: (data) => api.post("/reviews", data),
  getProductReviews: (productId) =>
    api.get(`/reviews/product/${productId}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;