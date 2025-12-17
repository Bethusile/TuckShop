// server/src/handlers/dashboardHandler.ts
import { Request, Response } from 'express';
import { getDashboardMetrics } from '../services/dashboardService';

export const getMetricsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const metrics = await getDashboardMetrics();
        res.json(metrics);
    } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        res.status(500).json({ error: 'Failed to retrieve dashboard metrics.' });
    }
};
