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

        // 1. Record the Movement (INSERT into stockmovements)
        const [newMovement] = await trx('stockmovements')
            .insert({
                productid,
                movementtype,
                quantitychange,
            })
            .returning('*');

        // 2. Update the Product Stock Level (UPDATE product)
        const [updatedProductCount] = await trx('product')
            .where({ itemid: productid })
            .increment('stocklevel', quantitychange) // Knex method for safe arithmetic
            .returning('itemid'); // Use returning to confirm update

        if (updatedProductCount === undefined) {
             // If the product wasn't found, rollback the transaction
            throw new Error(`Product with ID ${productid} not found.`);
        }

        return newMovement;
    });
};

// 2. READ ALL Stock Movements
export const fetchAllStockMovements = async (): Promise<any[]> => {
    // Join with Product table to show the product name with the movement
    return db('stockmovements as sm')
        .select(
            'sm.movementid',
            'sm.movementtype',
            'sm.quantitychange',
            'sm.movementtimestamp',
            'p.name as product_name'
        )
        .leftJoin('product as p', 'sm.productid', 'p.itemid')
        .orderBy('sm.movementtimestamp', 'desc');
};