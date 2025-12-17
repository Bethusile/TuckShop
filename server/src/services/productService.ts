// server/src/services/productService.ts
import db from '../knex';

// --- Types (Good practice to define types for your data) ---
interface Product {
    itemid: number;
    name: string;
    description: string;
    price: number;
    stocklevel: number;
    isactive: boolean;
    categoryid: number | null;
}

// --- Service Logic ---

// READ ALL PRODUCTS
export const fetchAllProducts = async (): Promise<Product[]> => {
    // Uses Knex Query Builder for readability and safety
    return db('product')
        .select(
            'p.itemid',
            'p.name',
            'p.description',
            'p.price',
            'p.stocklevel',
            'p.isactive',
            'c.name as category_name'
        )
        .from('product as p')
        .leftJoin('category as c', 'p.categoryid', 'c.categoryid')
        .orderBy('p.itemid', 'asc');
};

// READ ONE PRODUCT
// Returns a single Product object or undefined if not found
export const fetchProductById = async (itemid: number): Promise<Product | undefined> => {
    // Knex .first() method is perfect for retrieving a single row
    return db('product')
        .select('*')
        .where({ itemid })
        .first(); 
};

// CREATE PRODUCT
export const createProduct = async (productData: Omit<Product, 'itemid'>): Promise<Product> => {
    // Validate stock level is not negative
    if (productData.stocklevel < 0) {
        throw new Error('Stock level cannot be negative. Must be 0 or greater.');
    }
    
    return await db.transaction(async (trx) => {
        const [newProduct] = await trx('product')
            .insert(productData)
            .returning('*');
        
        // Record initial stock as a purchase if stocklevel > 0
        if (newProduct.stocklevel > 0) {
            await trx('stockmovements').insert({
                productid: newProduct.itemid,
                product_name: newProduct.name,
                quantitychange: newProduct.stocklevel,
                movementtype: 'PURCHASE',
                reason: 'Initial Stock',
                movementtimestamp: new Date()
            });
        }
        
        return newProduct;
    });
};

// UPDATE PRODUCT
export const updateProduct = async (itemid: number, productData: Partial<Product>): Promise<number> => {
    // Validate stock level is not negative if being updated
    if (productData.stocklevel !== undefined && productData.stocklevel < 0) {
        throw new Error('Stock level cannot be negative. Must be 0 or greater.');
    }
    
    return await db.transaction(async (trx) => {
        // Get old stock level
        const oldProduct = await trx('product').where({ itemid }).first();
        
        const updatedCount = await trx('product')
            .where({ itemid })
            .update(productData);
        
        // If stock level changed, record it as purchase or adjustment
        if (productData.stocklevel !== undefined && oldProduct) {
            const difference = productData.stocklevel - oldProduct.stocklevel;
            if (difference !== 0) {
                const productName = productData.name || oldProduct.name;
                await trx('stockmovements').insert({
                    productid: itemid,
                    product_name: productName,
                    quantitychange: difference,
                    movementtype: difference > 0 ? 'PURCHASE' : 'ADJUSTMENT',
                    reason: difference > 0 ? 'Stock Restock' : 'Stock Adjustment',
                    movementtimestamp: new Date()
                });
            }
        }
        
        return updatedCount;
    });
};

// DELETE PRODUCT
export const deleteProduct = async (itemid: number): Promise<number> => {
    return await db.transaction(async (trx) => {
        // Get product details before deletion
        const product = await trx('product').where({ itemid }).first();
        
        if (!product) {
            throw new Error(`Product with ID ${itemid} not found.`);
        }
        
        // Record adjustment movement to zero out stock before deletion
        if (product.stocklevel !== 0) {
            await trx('stockmovements').insert({
                productid: itemid,
                product_name: product.name,
                quantitychange: -product.stocklevel,
                movementtype: 'ADJUSTMENT',
                reason: `Product Deleted: ${product.name}`,
                movementtimestamp: new Date()
            });
        }
        
        // Delete the product (stockmovements.productid will be set to NULL due to ON DELETE SET NULL)
        const deletedCount = await trx('product').where({ itemid }).del();
        return deletedCount;
    });
};