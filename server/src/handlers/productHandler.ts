// server/src/handlers/productHandler.ts
import { Request, Response } from 'express';
import * as productService from '../services/productService'; // Import the service

// GET all products handler
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await productService.fetchAllProducts();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve products.' });
    }
};

// POST create product handler
export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create product. Check input data.' });
    }
};

// GET one product handler
export const getProductByIdHandler = async (req: Request, res: Response): Promise<void> => {
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
        } else {
            res.json(product);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve product.' });
    }
};

// PUT update product handler
// server/src/handlers/productHandler.ts

export const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
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
        } else {
            res.json({ message: 'Product updated successfully.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

// DELETE product handler
export const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
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
        } else {
            res.json({ message: 'Product deleted successfully.' });
        }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete product.' });
        }
};