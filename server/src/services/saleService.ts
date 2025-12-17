// server/src/services/saleService.ts
import db from '../knex';

interface SaleItem {
    productid: number;
    quantity: number;
    price: number;
}

export const processSale = async (items: SaleItem[]): Promise<void> => {
    // Use a transaction to ensure atomicity
    await db.transaction(async (trx) => {
        for (const item of items) {
            // 1. Check if product exists and has sufficient stock
            const product = await trx('product')
                .where({ itemid: item.productid })
                .first();

            if (!product) {
                throw new Error(`Product with ID ${item.productid} not found.`);
            }

            if (product.stocklevel < item.quantity) {
                throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stocklevel}, Requested: ${item.quantity}`);
            }

            // 2. Deduct stock
            await trx('product')
                .where({ itemid: item.productid })
                .decrement('stocklevel', item.quantity);

            // 3. Record stock movement with product name
            await trx('stockmovements').insert({
                productid: item.productid,
                product_name: product.name,
                quantitychange: -item.quantity, // Negative for sale
                movementtype: 'SALE',
                reason: 'POS Sale',
                movementtimestamp: new Date()
            });
        }
    });
};

export const processRefund = async (movementId: number, reason: string): Promise<void> => {
    await db.transaction(async (trx) => {
        // Get the original sale movement
        const movement = await trx('stockmovements')
            .where({ movementid: movementId, movementtype: 'SALE' })
            .first();

        if (!movement) {
            throw new Error(`Sale movement with ID ${movementId} not found.`);
        }

        // Add stock back (reverse the sale)
        await trx('product')
            .where({ itemid: movement.productid })
            .increment('stocklevel', Math.abs(movement.quantitychange));

        // Get product name for the movement
        const product = await trx('product').where({ itemid: movement.productid }).first();
        const productName = product ? product.name : movement.product_name || 'Unknown Product';
        
        // Record refund movement
        await trx('stockmovements').insert({
            productid: movement.productid,
            product_name: productName,
            quantitychange: Math.abs(movement.quantitychange), // Positive for refund
            movementtype: 'REFUND',
            reason: reason || 'Customer Refund',
            movementtimestamp: new Date()
        });
    });
};

export const updateMovementReason = async (movementId: number, reason: string): Promise<void> => {
    await db('stockmovements')
        .where({ movementid: movementId })
        .update({ reason });
};

export const processReturn = async (movementId: number, reason: string): Promise<void> => {
    await db.transaction(async (trx) => {
        // Get the original purchase movement
        const movement = await trx('stockmovements')
            .where({ movementid: movementId, movementtype: 'PURCHASE' })
            .first();

        if (!movement) {
            throw new Error(`Purchase movement with ID ${movementId} not found.`);
        }

        // Get current product stock
        const product = await trx('product').where({ itemid: movement.productid }).first();
        if (!product) {
            throw new Error(`Product with ID ${movement.productid} not found.`);
        }
        
        // The purchase quantitychange should be positive (e.g., +10 means 10 items added)
        // To return, we need to subtract that amount
        const purchaseQuantity = movement.quantitychange;
        
        // Validate the purchase quantity is positive
        if (purchaseQuantity <= 0) {
            throw new Error(`Invalid purchase quantity: ${purchaseQuantity}. Purchase movements should have positive quantity.`);
        }
        
        // Calculate what the new stock would be after the return
        const newStockLevel = product.stocklevel - purchaseQuantity;
        
        // Prevent negative stock
        if (newStockLevel < 0) {
            throw new Error(
                `Cannot process return. Returning ${purchaseQuantity} units would result in negative stock. ` +
                `Current stock: ${product.stocklevel}. Stock cannot go below 0.`
            );
        }

        // Deduct stock (reverse the purchase)
        await trx('product')
            .where({ itemid: movement.productid })
            .update({ stocklevel: newStockLevel });

        // Record return movement (negative quantity to show stock decrease)
        await trx('stockmovements').insert({
            productid: movement.productid,
            product_name: product.name,
            quantitychange: -purchaseQuantity,
            movementtype: 'RETURN',
            reason: reason || 'Purchase Return',
            movementtimestamp: new Date()
        });
    });
};
