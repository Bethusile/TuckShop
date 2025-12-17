// server/src/services/dashboardService.ts
import db from '../knex';

export interface DashboardMetrics {
  totalRevenueToday: number;
  totalTransactionsToday: number;
  totalReturnsToday: number;
  mostPopularItem: { product_name: string; quantity_sold: number } | null;
  totalInventoryValue: number;
  lowStockItems: Array<{ productid: number; name: string; stock: number; safety_level: number }>;
  categoryCount: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Revenue today = sum of abs(sale quantities) * product price, where movementtype = 'SALE'
  const [revenueRow] = await db('stockmovements as sm')
    .leftJoin('product as p', 'sm.productid', 'p.itemid')
    .where('sm.movementtype', 'SALE')
    .andWhere('sm.movementtimestamp', '>=', startOfToday)
    .select(db.raw('COALESCE(SUM(ABS(sm.quantitychange) * p.price), 0) as totalrevenue'));
  const totalRevenueToday = Number((revenueRow as any)?.totalrevenue || 0);

  // Transactions today = count of SALE movements today
  const [txRow] = await db('stockmovements as sm')
    .where('sm.movementtype', 'SALE')
    .andWhere('sm.movementtimestamp', '>=', startOfToday)
    .count<{ count: string }[]>({ count: '*' });
  const totalTransactionsToday = Number((txRow as any)?.count || 0);

  // Refunds today = sum of abs(refund quantities) * product price, where movementtype = 'REFUND' only
  const [returnsRow] = await db('stockmovements as sm')
    .leftJoin('product as p', 'sm.productid', 'p.itemid')
    .where('sm.movementtype', 'REFUND')
    .andWhere('sm.movementtimestamp', '>=', startOfToday)
    .select(db.raw('COALESCE(SUM(ABS(sm.quantitychange) * p.price), 0) as totalreturns'));
  const totalReturnsToday = Number((returnsRow as any)?.totalreturns || 0);

  // Most popular item by quantity sold today
  const mostPopular = await db('stockmovements as sm')
    .leftJoin('product as p', 'sm.productid', 'p.itemid')
    .where('sm.movementtype', 'SALE')
    .andWhere('sm.movementtimestamp', '>=', startOfToday)
    .groupBy('p.name')
    .select('p.name as product_name')
    .select(db.raw('SUM(ABS(sm.quantitychange)) as quantity_sold'))
    .orderBy('quantity_sold', 'desc')
    .first();

  // Total inventory value = sum(price * stocklevel)
  const [invRow] = await db('product as p')
    .select(db.raw('COALESCE(SUM(p.price * p.stocklevel), 0) as totalvalue'));
  const totalInventoryValue = Number((invRow as any)?.totalvalue || 0);

  // Low stock items (<= safety level)
  const SAFETY_LEVEL = 5;
  const lowStockRows = await db('product')
    .where('stocklevel', '<=', SAFETY_LEVEL)
    .andWhere('isactive', true)
    .select('itemid as productid', 'name', 'stocklevel as stock')
    .select(db.raw('? as safety_level', [SAFETY_LEVEL]))
    .orderBy('stocklevel', 'asc')
    .limit(10);

  // Category count
  const [catRow] = await db('category')
    .count<{ count: string }[]>({ count: '*' });
  const categoryCount = Number((catRow as any)?.count || 0);

  return {
    totalRevenueToday,
    totalTransactionsToday,
    totalReturnsToday,
    mostPopularItem: mostPopular ? {
      product_name: mostPopular.product_name,
      quantity_sold: Number(mostPopular.quantity_sold)
    } : null,
    totalInventoryValue,
    lowStockItems: lowStockRows,
    categoryCount
  };
};
