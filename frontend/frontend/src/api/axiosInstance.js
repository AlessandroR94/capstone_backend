import axios from 'axios';
import { setGlobalLoading } from '../context/LoadingContext';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Interceptor per mostrare loading
axiosInstance.interceptors.request.use((config) => {
  setGlobalLoading(true);
  return config;
}, (error) => {
  setGlobalLoading(false);
  return Promise.reject(error);
});

// Interceptor per nascondere loading
axiosInstance.interceptors.response.use((response) => {
  setGlobalLoading(false);
  return response;
}, (error) => {
  setGlobalLoading(false);
  return Promise.reject(error);
});

export default axiosInstance;
