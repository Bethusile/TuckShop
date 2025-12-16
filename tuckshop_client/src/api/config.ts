// tuckshop_client/src/api/config.ts

import axios from 'axios';

// Set the base URL for your Express server
// Ensure your Express server is running on port 5000!
const API = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;