// server/src/handlers/stockMovementHandler.ts
import { Request, Response } from 'express';
import * as stockMovementService from '../services/stockMovementService';

// POST: Record a new stock movement (Sale, Restock, Adjustment)
export const recordMovementHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productid, movementtype, quantitychange } = req.body;
        
        // Basic validation (can be enhanced with Joi/yup later)
        if (!productid || !movementtype || quantitychange === undefined) {
            res.status(400).json({ error: 'Missing required fields: productid, movementtype, or quantitychange.' });
            return;
        }

        // Delegate transaction logic to the service
        const newMovement = await stockMovementService.recordStockMovement({
            productid,
            movementtype,
            quantitychange,
        });

        res.status(201).json(newMovement);
    } catch (error: any) {
        console.error('Movement Error:', error.message);
        // Catch the error thrown from the transaction (e.g., product not found)
        if (error.message.includes('Product with ID')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to record stock movement due to a server error.' });
        }
    }
};

// GET: Retrieve all stock movement history
export const getAllMovementsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const movements = await stockMovementService.fetchAllStockMovements();
        res.json(movements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve stock movement history.' });
    }
};