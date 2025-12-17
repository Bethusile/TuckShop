"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetricsHandler = void 0;
const dashboardService_1 = require("../services/dashboardService");
const getMetricsHandler = async (_req, res) => {
    try {
        const metrics = await (0, dashboardService_1.getDashboardMetrics)();
        res.json(metrics);
    }
    catch (err) {
        console.error('Dashboard metrics error:', err);
        res.status(500).json({ error: 'Failed to load dashboard metrics.' });
    }
};
exports.getMetricsHandler = getMetricsHandler;
//# sourceMappingURL=dashboardHandler.js.map