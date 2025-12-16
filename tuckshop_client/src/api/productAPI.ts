// tuckshop_client/src/api/productAPI.ts (FULL CODE)

import API from './config';
import type { IProduct, ICreateProduct } from '../types/Product';

/**
 * Fetches all products from the backend.
 * @returns A promise resolving to an array of IProduct objects.
 */
export const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const response = await API.get<any[]>('/products');
        // Convert price from string to number if needed and map itemid to productid
        const products = response.data.map(product => ({
            ...product,
            productid: product.productid || product.itemid, // Handle both field names
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            stock: product.stock || product.stocklevel, // Use 'stock' for IProduct consistency
            stocklevel: product.stocklevel || product.stock,
            category_name: product.category ? product.category.name : product.category_name,
        }));
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

/**
 * Creates a new product.
 * @param newProduct The product data to create.
 * @returns A promise resolving to the created IProduct object.
 */
export const createProduct = async (newProduct: ICreateProduct): Promise<IProduct> => {
    try {
        const response = await API.post<any>('/products', newProduct);
        const product = response.data;
        // Ensure price/stock are numbers on return
        return {
            ...product,
            productid: product.productid || product.itemid,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            stocklevel: typeof product.stocklevel === 'string' ? parseInt(product.stocklevel) : product.stocklevel,
        };
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

// --- ADDED FUNCTION: UPDATE ---
/**
 * Updates an existing product.
 * @param id The ID of the product to update.
 * @param updatedProduct The product data to update.
 * @returns A promise resolving to the updated IProduct object.
 */
export const updateProduct = async (id: number, updatedProduct: ICreateProduct): Promise<IProduct> => {
    try {
        // Assuming your backend expects a PUT or PATCH request to /products/:id
        const response = await API.put<IProduct>(`/products/${id}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error(`Error updating product ID ${id}:`, error);
        throw error;
    }
};
// -----------------------------

/**
 * Deletes a product by ID.
 * @param id The ID of the product to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteProduct = async (id: number): Promise<void> => {
    try {
        await API.delete(`/products/${id}`);
    } catch (error) {
        console.error(`Error deleting product ID ${id}:`, error);
        throw error;
    }
};

// --- NEW TYPE FOR CHECKOUT ---
interface ISaleItem {
    productid: number;
    quantity: number;
    price: number;
}

/**
 * Executes a sale transaction, deducting stock for all items in the cart.
 * @param saleItems An array of items sold, including productid and quantity.
 * @returns A promise that resolves when the sale is successful.
 */
export const checkoutSale = async (saleItems: ISaleItem[]): Promise<void> => {
    try {
        // Assuming backend handles transaction: deduction, logging, and validation
        await API.post('/sales/checkout', { items: saleItems });
    } catch (error) {
        // The backend should return a specific error if stock is insufficient
        console.error("Error during checkout:", error);
        throw error;
    }
};