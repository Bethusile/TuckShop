"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllStockMovements = exports.recordStockMovement = void 0;
// server/src/services/stockMovementService.ts
const knex_1 = __importDefault(require("../knex"));
// --- Service Logic ---
// 1. CREATE Stock Movement (CRITICAL: Uses a Transaction)
const recordStockMovement = async (movementData) => {
    // Knex transaction ensures both the INSERT and the UPDATE succeed or fail together.
    return knex_1.default.transaction(async (trx) => {
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
exports.recordStockMovement = recordStockMovement;
// 2. READ ALL Stock Movements
const fetchAllStockMovements = async () => {
    // Join with Product table to show the product name with the movement
    return (0, knex_1.default)('stockmovements as sm')
        .select('sm.movementid', 'sm.movementtype', 'sm.quantitychange', 'sm.movementtimestamp', 'p.name as product_name')
        .leftJoin('product as p', 'sm.productid', 'p.itemid')
        .orderBy('sm.movementtimestamp', 'desc');
};
exports.fetchAllStockMovements = fetchAllStockMovements;
//# sourceMappingURL=stockMovementService.js.map