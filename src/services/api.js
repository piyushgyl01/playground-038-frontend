// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL and credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const authService = {
  register: async (credentials) => {
    const response = await api.post('/users', { ...credentials });
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/users/login', { ...credentials });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
  updateUser: async (userData) => {
    const response = await api.put('/user', { ...userData });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/user/refresh-token');
    return response.data;
  }
};

// Article services
export const articleService = {
  getArticles: async () => {
    const response = await api.get('/articles');
    return response.data;
  },
  getArticle: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },
  createArticle: async (article) => {
    // Note: we're letting the backend handle slug generation now
    const response = await api.post('/articles', { ...article });
    return response.data;
  },
  updateArticle: async (id, article) => {
    // Note: we're letting the backend handle slug updates
    const response = await api.put(`/articles/${id}`, { ...article });
    return response.data;
  },
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
  toggleFavorite: async (id) => {
    const response = await api.post(`/articles/${id}/favorite`);
    return response.data;
  }
};

// Profile services
export const profileService = {
  getProfile: async (username) => {
    const response = await api.get(`/profiles/${username}`);
    return response.data;
  },
  toggleFollow: async (username) => {
    const response = await api.post(`/profiles/${username}/follow`);
    return response.data;
  }
};

// Comment services
export const commentService = {
  getComments: async (articleId) => {
    const response = await api.get(`/articles/${articleId}/comments`);
    return response.data;
  },
  addComment: async (articleId, body) => {
    const response = await api.post(`/articles/${articleId}/comments`, { body });
    return response.data;
  },
  deleteComment: async (articleId, commentId) => {
    const response = await api.delete(`/articles/${articleId}/comments/${commentId}`);
    return response.data;
  }
};

// Tag services
export const tagService = {
  getTags: async () => {
    const response = await api.get('/tags');
    return response.data;
  }
};

// Intercept responses for handling 401 Unauthorized errors (expired token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await authService.refreshToken();
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;