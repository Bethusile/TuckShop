// server/src/handlers/saleHandler.ts
import { Request, Response } from 'express';
import { processSale, processRefund, updateMovementReason, processReturn } from '../services/saleService';

export const checkoutHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: 'Invalid request. Items array is required.' });
            return;
        }

        await processSale(items);
        res.status(200).json({ message: 'Sale completed successfully.' });
    } catch (err: any) {
        console.error('Error processing sale:', err);
        res.status(500).json({ error: err.message || 'Failed to process sale.' });
    }
};

export const refundHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { movementId, reason } = req.body;

        if (!movementId) {
            res.status(400).json({ error: 'Movement ID is required.' });
            return;
        }

        await processRefund(movementId, reason);
        res.status(200).json({ message: 'Refund processed successfully.' });
    } catch (err: any) {
        console.error('Error processing refund:', err);
        res.status(500).json({ error: err.message || 'Failed to process refund.' });
    }
};

export const updateReasonHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            res.status(400).json({ error: 'Reason is required.' });
            return;
        }

        await updateMovementReason(parseInt(id), reason);
        res.status(200).json({ message: 'Reason updated successfully.' });
    } catch (err: any) {
        console.error('Error updating reason:', err);
        res.status(500).json({ error: err.message || 'Failed to update reason.' });
    }
};

export const returnHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { movementId, reason } = req.body;

        if (!movementId || !reason) {
            res.status(400).json({ error: 'Movement ID and reason are required.' });
            return;
        }

        await processReturn(movementId, reason);
        res.status(200).json({ message: 'Return processed successfully.' });
    } catch (err: any) {
        console.error('Error processing return:', err);
        res.status(500).json({ error: err.message || 'Failed to process return.' });
    }
};
