import axios from 'axios';
import { setGlobalLoading } from '../context/LoadingContext';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

axiosInstance.interceptors.request.use((config) => {
  setGlobalLoading(true);

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  setGlobalLoading(false);
  return Promise.reject(error);
});


axiosInstance.interceptors.response.use((response) => {
  setGlobalLoading(false);
  return response;
}, (error) => {
  setGlobalLoading(false);

  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return Promise.reject(error);
});


export default axiosInstance;
