import axios from 'axios';

const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
