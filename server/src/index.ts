// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { 
    getAllProducts, 
    createProductHandler, 
    updateProductHandler, 
    deleteProductHandler, 
    getProductByIdHandler,
} from './handlers/productHandler';

import { 
    recordMovementHandler, 
    getAllMovementsHandler // <-- New Imports
} from './handlers/stockMovementHandler';

import { // <-- New Category Imports
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler
} from './handlers/categoryHandler';
import { getMetricsHandler } from './handlers/dashboardHandler';

import * as dotenv from 'dotenv'; // Import dotenv to load variables
dotenv.config(); // Load variables at startup

const app = express();
const port = process.env.SERVER_PORT || 5000;

// CORS CONFIGURATION
import { CorsOptions } from 'cors';
// --- 1. DEFINE ALLOWED ORIGINS ---
// NOTE: You must replace the placeholder with your actual deployed Netlify URL
const allowedOrigins = [
    'http://localhost:3000', // Frontend development (React default)
    'https://<https://tuckshopapp.netlify.app', // netlify DOMAIN
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // If the origin is in our allowed list OR if the request has no origin (e.g., Postman/cURL/same server request), allow it.
        // The !origin check is vital for services like Render doing health checks or local direct calls.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};


// MIDDLEWARE
// --- 2. APPLY THE CONFIGURATION ---
app.use(cors(corsOptions)); // <-- Use the configured corsOptions object
app.use(express.json());

// ======================
// PRODUCT ROUTES (Table: Product)
// ======================

app.get('/products', getAllProducts);
app.get('/products/:id', getProductByIdHandler); // <-- New Route
app.post('/products', createProductHandler);
app.put('/products/:id', updateProductHandler);
app.delete('/products/:id', deleteProductHandler);


// ======================
// CATEGORY ROUTES (Table: Category)
// ======================
app.get('/categories', getAllCategoriesHandler);
app.get('/categories/:id', getCategoryByIdHandler);
app.post('/categories', createCategoryHandler);
app.put('/categories/:id', updateCategoryHandler);
app.delete('/categories/:id', deleteCategoryHandler);


// ======================================
// STOCK MOVEMENTS ROUTES (Table: StockMovements)
// ======================================

// 10. CREATE a Stock Movement (POST /movements) - Records a sale, restock, or adjustment
app.post('/movements', recordMovementHandler);
app.get('/movements', getAllMovementsHandler);

// ======================
// DASHBOARD ROUTES
// ======================
app.get('/dashboard/metrics', getMetricsHandler);

// START SERVER
app.listen(port, () => {
    console.log(`Tuckshop TypeScript Server is running on http://localhost:${port}`);
});