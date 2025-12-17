"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
// server/src/services/dashboardService.ts
const knex_1 = __importDefault(require("../knex"));
const getDashboardMetrics = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // Revenue today = sum of abs(sale quantities) * product price, where movementtype = 'SALE'
    const [revenueRow] = await (0, knex_1.default)('stockmovements as sm')
        .leftJoin('product as p', 'sm.productid', 'p.itemid')
        .where('sm.movementtype', 'SALE')
        .andWhere('sm.movementtimestamp', '>=', startOfToday)
        .select(knex_1.default.raw('COALESCE(SUM(ABS(sm.quantitychange) * p.price), 0) as totalrevenue'));
    const totalRevenueToday = Number(revenueRow?.totalrevenue || 0);
    // Transactions today = count of SALE movements today (treat each movement as a transaction)
    const [txRow] = await (0, knex_1.default)('stockmovements as sm')
        .where('sm.movementtype', 'SALE')
        .andWhere('sm.movementtimestamp', '>=', startOfToday)
        .count({ count: '*' });
    const totalTransactionsToday = Number(txRow?.count || 0);
    // Most popular item by quantity sold today
    const mostPopular = await (0, knex_1.default)('stockmovements as sm')
        .leftJoin('product as p', 'sm.productid', 'p.itemid')
        .where('sm.movementtype', 'SALE')
        .andWhere('sm.movementtimestamp', '>=', startOfToday)
        .groupBy('p.name')
        .select('p.name as product_name')
        .select(knex_1.default.raw('SUM(ABS(sm.quantitychange)) as quantity_sold'))
        .orderBy('quantity_sold', 'desc')
        .first();
    // Total inventory value = sum(price * stocklevel)
    const [invRow] = await (0, knex_1.default)('product as p')
        .select(knex_1.default.raw('COALESCE(SUM(p.price * p.stocklevel), 0) as totalvalue'));
    const totalInventoryValue = Number(invRow?.totalvalue || 0);
    // Low stock items (<= safety level)
    const SAFETY_LEVEL = 5;
    const lowStockRows = await (0, knex_1.default)('product')
        .where('stocklevel', '<=', SAFETY_LEVEL)
        .andWhere('isactive', true)
        .select('itemid as productid', 'name', 'stocklevel as stock')
        .orderBy('stocklevel', 'asc')
        .limit(10);
    const lowStockItems = lowStockRows.map(r => ({ ...r, safety_level: SAFETY_LEVEL }));
    // Category count
    const [catRow] = await (0, knex_1.default)('category').count({ count: '*' });
    const categoryCount = Number(catRow?.count || 0);
    return {
        totalRevenueToday,
        totalTransactionsToday,
        mostPopularItem: mostPopular
            ? { product_name: mostPopular.product_name, quantity_sold: Number(mostPopular.quantity_sold) }
            : null,
        totalInventoryValue,
        lowStockItems,
        categoryCount,
    };
};
exports.getDashboardMetrics = getDashboardMetrics;
//# sourceMappingURL=dashboardService.js.map