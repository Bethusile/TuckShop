// server/src/services/stockMovementService.ts
import db from '../knex';

// --- Types ---
interface StockMovement {
    movementid: number;
    productid: number;
    movementtype: 'SALE' | 'RESTOCK' | 'ADJUSTMENT'; // Define valid movement types
    quantitychange: number; // Positive for restock, negative for sale/adjustment out
    movementtimestamp: Date;
}

interface NewStockMovement {
    productid: number;
    movementtype: StockMovement['movementtype'];
    quantitychange: number;
}

// --- Service Logic ---

// 1. CREATE Stock Movement (CRITICAL: Uses a Transaction)
export const recordStockMovement = async (movementData: NewStockMovement): Promise<StockMovement> => {
    // Knex transaction ensures both the INSERT and the UPDATE succeed or fail together.
    return db.transaction(async (trx) => {
        const { productid, movementtype, quantitychange } = movementData;

        // Check current stock level before applying change
        const product = await trx('product').where({ itemid: productid }).first();
        
        if (!product) {
            throw new Error(`Product with ID ${productid} not found.`);
        }
        
        const newStockLevel = product.stocklevel + quantitychange;
        if (newStockLevel < 0) {
            throw new Error(`Insufficient stock. Current stock: ${product.stocklevel}, Attempted change: ${quantitychange}. Stock cannot go below 0.`);
        }

        // 1. Record the Movement (INSERT into stockmovements)
        const [newMovement] = await trx('stockmovements')
            .insert({
                productid,
                movementtype,
                quantitychange,
            })
            .returning('*');

        // 2. Update the Product Stock Level (UPDATE product)
        await trx('product')
            .where({ itemid: productid })
            .increment('stocklevel', quantitychange);

        return newMovement;
    });
};

// 2. READ ALL Stock Movements
export const fetchAllStockMovements = async (): Promise<any[]> => {
    // Join with Product table to show the product name with the movement
    // Use stored product_name first, then fall back to current product name
    return db('stockmovements as sm')
        .select(
            'sm.movementid',
            'sm.productid',
            'sm.movementtype',
            'sm.quantitychange',
            'sm.movementtimestamp',
            'sm.reason',
            db.raw(`COALESCE(sm.product_name, p.name, 'Unknown Product') as product_name`)
        )
        .leftJoin('product as p', 'sm.productid', 'p.itemid')
        .orderBy('sm.movementtimestamp', 'desc');
};

// Note: Stock movements should NOT be deleted to maintain audit trail
// Use processRefund() or processReturn() in saleService to reverse movements