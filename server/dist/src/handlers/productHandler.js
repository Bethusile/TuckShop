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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.updateProductHandler = exports.getProductByIdHandler = exports.createProductHandler = exports.getAllProducts = void 0;
const productService = __importStar(require("../services/productService")); // Import the service
// GET all products handler
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.fetchAllProducts();
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve products.' });
    }
};
exports.getAllProducts = getAllProducts;
// POST create product handler
const createProductHandler = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create product. Check input data.' });
    }
};
exports.createProductHandler = createProductHandler;
// GET one product handler
const getProductByIdHandler = async (req, res) => {
    try {
        const idParam = req.params.id;
        // 1. Validation (Type Narrowing fix)
        if (!idParam) {
            res.status(400).json({ error: 'Missing product ID in the route parameters.' });
            return;
        }
        const itemid = parseInt(idParam, 10);
        if (isNaN(itemid)) {
            res.status(400).json({ error: 'Invalid product ID provided.' });
            return;
        }
        // 2. Delegate to Service Layer
        const product = await productService.fetchProductById(itemid);
        if (!product) {
            res.status(404).json({ error: 'Product not found.' });
        }
        else {
            res.json(product);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve product.' });
    }
};
exports.getProductByIdHandler = getProductByIdHandler;
// PUT update product handler
// server/src/handlers/productHandler.ts
const updateProductHandler = async (req, res) => {
    try {
        const idParam = req.params.id; // Capture the parameter value
        // 1. Type Narrowing/Validation Check
        if (!idParam) {
            // Send an error response if the required parameter is missing
            res.status(400).json({ error: 'Missing product ID in the route parameters.' });
            return; // Exit the function immediately
        }
        // Now TypeScript knows idParam is definitely a string
        const itemid = parseInt(idParam, 10);
        // Basic validation: ensure it's a valid number after parsing
        if (isNaN(itemid)) {
            res.status(400).json({ error: 'Invalid product ID provided.' });
            return;
        }
        const updatedCount = await productService.updateProduct(itemid, req.body);
        if (updatedCount === 0) {
            res.status(404).json({ error: 'Product not found.' });
        }
        else {
            res.json({ message: 'Product updated successfully.' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};
exports.updateProductHandler = updateProductHandler;
// DELETE product handler
const deleteProductHandler = async (req, res) => {
    try {
        const idParam = req.params.id; // Capture the parameter value
        // 1. Type Narrowing/Validation Check
        if (!idParam) {
            // Send an error response if the required parameter is missing
            res.status(400).json({ error: 'Missing product ID in the route parameters.' });
            return; // Exit the function immediately
        }
        // 2. Convert and validate the ID
        // TypeScript now knows idParam is definitely a string
        const itemid = parseInt(idParam, 10);
        // Basic validation: ensure it's a valid number after parsing
        if (isNaN(itemid)) {
            res.status(400).json({ error: 'Invalid product ID provided.' });
            return;
        }
        // 3. Delegate to Service Layer
        const deletedCount = await productService.deleteProduct(itemid);
        if (deletedCount === 0) {
            res.status(404).json({ error: 'Product not found.' });
        }
        else {
            res.json({ message: 'Product deleted successfully.' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};
exports.deleteProductHandler = deleteProductHandler;
//# sourceMappingURL=productHandler.js.map