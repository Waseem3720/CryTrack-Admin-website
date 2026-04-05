
// ============================================
// adminFrontend/src/services/api.js
// ============================================
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

// User APIs
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Tutorial APIs
export const getAllTutorials = async () => {
  const response = await api.get('/tutorials');
  return response.data;
};

export const createTutorial = async (tutorialData) => {
  const response = await api.post('/tutorials', tutorialData);
  return response.data;
};

export const deleteTutorial = async (tutorialId) => {
  const response = await api.delete(`/tutorials/${tutorialId}`);
  return response.data;
};

export default api;

