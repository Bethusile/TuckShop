// tuckshop_client/src/types/Product.ts

/**
 * Interface for the Product entity, matching the database schema.
 */
export interface IProduct {
    productid: number;
    name: string;
    description: string | null; // Descriptions might be optional/null in the DB
    price: number;
    stocklevel: number;
    categoryid: number;
    // Optional: Include category name for display convenience
    category_name?: string; 
}

/**
 * Interface for creating or updating a Product (excludes auto-generated ID).
 */
export interface ICreateProduct {
    name: string;
    description: string | null;
    price: number;
    stocklevel: number;
    categoryid: number;
}