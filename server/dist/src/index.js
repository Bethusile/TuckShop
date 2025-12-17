"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productHandler_1 = require("./handlers/productHandler");
const stockMovementHandler_1 = require("./handlers/stockMovementHandler");
const categoryHandler_1 = require("./handlers/categoryHandler");
const dashboardHandler_1 = require("./handlers/dashboardHandler");
const dotenv = __importStar(require("dotenv")); // Import dotenv to load variables
dotenv.config(); // Load variables at startup
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 5000;
// --- 1. DEFINE ALLOWED ORIGINS ---
// NOTE: You must replace the placeholder with your actual deployed Netlify URL
const allowedOrigins = [
    'http://localhost:3000', // Frontend development (React default)
    'https://<https://tuckshopapp.netlify.app', // netlify DOMAIN
];
const corsOptions = {
    origin: (origin, callback) => {
        // If the origin is in our allowed list OR if the request has no origin (e.g., Postman/cURL/same server request), allow it.
        // The !origin check is vital for services like Render doing health checks or local direct calls.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};
// MIDDLEWARE
// --- 2. APPLY THE CONFIGURATION ---
app.use((0, cors_1.default)(corsOptions)); // <-- Use the configured corsOptions object
app.use(express_1.default.json());
// ======================
// PRODUCT ROUTES (Table: Product)
// ======================
app.get('/products', productHandler_1.getAllProducts);
app.get('/products/:id', productHandler_1.getProductByIdHandler); // <-- New Route
app.post('/products', productHandler_1.createProductHandler);
app.put('/products/:id', productHandler_1.updateProductHandler);
app.delete('/products/:id', productHandler_1.deleteProductHandler);
// ======================
// CATEGORY ROUTES (Table: Category)
// ======================
app.get('/categories', categoryHandler_1.getAllCategoriesHandler);
app.get('/categories/:id', categoryHandler_1.getCategoryByIdHandler);
app.post('/categories', categoryHandler_1.createCategoryHandler);
app.put('/categories/:id', categoryHandler_1.updateCategoryHandler);
app.delete('/categories/:id', categoryHandler_1.deleteCategoryHandler);
// ======================================
// STOCK MOVEMENTS ROUTES (Table: StockMovements)
// ======================================
// 10. CREATE a Stock Movement (POST /movements) - Records a sale, restock, or adjustment
app.post('/movements', stockMovementHandler_1.recordMovementHandler);
app.get('/movements', stockMovementHandler_1.getAllMovementsHandler);
// ======================
// DASHBOARD ROUTES
// ======================
app.get('/dashboard/metrics', dashboardHandler_1.getMetricsHandler);
// START SERVER
app.listen(port, () => {
    console.log(`Tuckshop TypeScript Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map