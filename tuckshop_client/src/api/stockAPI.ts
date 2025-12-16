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