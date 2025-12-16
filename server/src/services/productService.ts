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
            'p.itemid as productid',
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
    const [newProduct] = await db('product')
        .insert(productData)
        .returning('*');
    
    return newProduct;
};

// UPDATE PRODUCT
export const updateProduct = async (itemid: number, productData: Partial<Product>): Promise<number> => {
    const updatedCount = await db('product')
        .where({ itemid })
        .update(productData);
    
    return updatedCount;
};

// DELETE PRODUCT
export const deleteProduct = async (itemid: number): Promise<number> => {
    // Knex returns the number of rows affected
    const deletedCount = await db('product').where({ itemid }).del();
    return deletedCount;
};