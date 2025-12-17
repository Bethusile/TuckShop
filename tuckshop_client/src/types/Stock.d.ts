// tuckshop_client/src/types/Stock.d.ts (NEW FILE)

export interface IStockMovement {
    movementid: number;
    productid: number;
    product_name: string; // Assuming we denormalize/join this on the backend
    quantity_change: number; // Positive for restock, negative for sale/loss
    timestamp: string; // ISO 8601 string
    movementtype: 'SALE' | 'PURCHASE' | 'REFUND' | 'RETURN' | 'ADJUSTMENT';
    reason?: string; // Optional reason/description
    // saleid? // Optional link back to the sale transaction
}