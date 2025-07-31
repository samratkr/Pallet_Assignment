// src/api/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL:
    'https://catalog-management-system-dev-872387259014.uscentral1.run.app',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    console.error('Errror', error);
    Promise.reject(error);
  },
);

export default API;
