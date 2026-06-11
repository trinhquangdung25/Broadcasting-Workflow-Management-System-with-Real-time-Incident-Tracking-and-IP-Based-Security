import axios from 'axios';

const Client = axios.create({
  baseURL: 'http://localhost:5001/api', // Trỏ đúng cổng 5001 server backend của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Tự động đính kèm JWT Token vào Header để Backend xác thực user
Client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Client;