// tuckshop_client/src/api/dashboardAPI.ts (Verification/Creation)

import API from './config';
// Assuming you have IProduct and ICategory imported or defined here

export interface IDashboardData {
    totalRevenueToday: number;
    totalTransactionsToday: number;
    mostPopularItem: { 
        product_name: string; 
        quantity_sold: number; 
    } | null;
    totalInventoryValue: number;
    lowStockItems: Array<{ 
        productid: number; 
        name: string; 
        stock: number; 
        safety_level: number; 
    }>;
    categoryCount: number;
}

export const getDashboardMetrics = async (): Promise<IDashboardData> => {
    try {
        const response = await API.get<IDashboardData>('/dashboard/metrics'); // Your API endpoint
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        throw error;
    }
};