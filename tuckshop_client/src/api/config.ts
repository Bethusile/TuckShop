/// <reference types="node" />
import axios from 'axios';

// The Netlify environment variable for the backend API URL
// NOTE: We do not need the REACT_APP_ prefix on Netlify, 
// but it is safe to keep it if you need consistency.
const BASE_URL = process.env.REACT_APP_API_BASE_URL 
    ? process.env.REACT_APP_API_BASE_URL 
    : 'http://localhost:3001/api'; 

const API = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    // ... other headers
});

export default API;