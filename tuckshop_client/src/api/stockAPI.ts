// tuckshop_client/src/api/stockAPI.ts (CORRECTED FILE)

import API from './config';
import type { IStockMovement } from '../types/Stock';

/**
 * Fetches the historical record of all stock changes/movements.
 * @returns A promise resolving to an array of IStockMovement objects.
 */
export const getStockMovementHistory = async (): Promise<IStockMovement[]> => {
    try {
        // CORRECTED: Changed endpoint from /stock/history to /movements
        const response = await API.get<IStockMovement[]>('/movements'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching stock movement history:", error);
        throw error;
    }
};

/**
 * Updates the reason for a stock movement.
 * @param id The movement ID
 * @param reason The new reason text
 */
export const updateMovementReason = async (id: number, reason: string): Promise<void> => {
    try {
        await API.put(`/movements/${id}/reason`, { reason });
    } catch (error) {
        console.error(`Error updating movement ${id} reason:`, error);
        throw error;
    }
};

/**
 * Processes a refund for a sale (reverses a SALE movement).
 * @param movementId The sale movement ID to refund
 * @param reason The reason for the refund
 */
export const processRefund = async (movementId: number, reason: string): Promise<void> => {
    try {
        await API.post('/sales/refund', { movementId, reason });
    } catch (error) {
        console.error(`Error processing refund for movement ${movementId}:`, error);
        throw error;
    }
};

/**
 * Processes a return for a purchase (reverses a PURCHASE movement).
 * @param movementId The purchase movement ID to return
 * @param reason The reason for the return
 */
export const processPurchaseReturn = async (movementId: number, reason: string): Promise<void> => {
    try {
        await API.post('/sales/return', { movementId, reason });
    } catch (error) {
        console.error(`Error processing return for movement ${movementId}:`, error);
        throw error;
    }
};