// src/api/issueApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/issues`;
const ADMIN_API_URL = `${BASE_URL}/admin`;

// User Issue APIs
export const createIssue = async (issue, token) => {
  const res = await axios.post(API_URL, issue, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getIssues = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateIssue = async (id, data, token) => {
  const res = await axios.patch(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addComment = async (id, comment, token) => {
  const res = await axios.post(`${API_URL}/${id}/comments`, { text: comment }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Admin APIs
export const getPendingIssuesAdmin = async (token) => {
  const res = await axios.get(`${ADMIN_API_URL}/pending-issues`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const resolveIssueAdmin = async (id, token) => {
  const res = await axios.post(`${ADMIN_API_URL}/resolve-issue/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteResolvedIssueAdmin = async (id, token) => {
  const res = await axios.delete(`${ADMIN_API_URL}/resolved-issues/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
