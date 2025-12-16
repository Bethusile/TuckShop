// server/src/handlers/dashboardHandler.ts
import { Request, Response } from 'express';
import { getDashboardMetrics } from '../services/dashboardService';

export const getMetricsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (err) {
    console.error('Dashboard metrics error:', err);
    res.status(500).json({ error: 'Failed to load dashboard metrics.' });
  }
};
