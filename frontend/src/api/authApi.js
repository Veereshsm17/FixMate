import axios from 'axios';

// Use .env variable (fallback to localhost if not set)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};
