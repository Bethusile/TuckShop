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
    getAllMovementsHandler
} from './handlers/stockMovementHandler';

import { // <-- New Category Imports
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler
} from './handlers/categoryHandler';
import { getMetricsHandler } from './handlers/dashboardHandler';
import { checkoutHandler, refundHandler, updateReasonHandler, returnHandler } from './handlers/saleHandler';

import * as dotenv from 'dotenv'; // Import dotenv to load variables
dotenv.config(); // Load variables at startup

const app = express();
const port = process.env.SERVER_PORT || 5000;

// MIDDLEWARE
app.use(cors());
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

// ======================================
// DASHBOARD ROUTES
// ======================================
app.get('/dashboard/metrics', getMetricsHandler);

// ======================================
// SALES ROUTES
// ======================================
app.post('/sales/checkout', checkoutHandler);
app.post('/sales/refund', refundHandler);
app.post('/sales/return', returnHandler);
app.put('/movements/:id/reason', updateReasonHandler);

// START SERVER
app.listen(port, () => {
    console.log(`Tuckshop TypeScript Server is running on http://localhost:${port}`);
});