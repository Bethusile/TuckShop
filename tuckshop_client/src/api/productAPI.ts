// tuckshop_client/src/api/product.ts

import API from './config';
import type { IProduct, ICreateProduct } from '../types/Product';

/**
 * Fetches all products from the backend.
 * @returns A promise resolving to an array of IProduct objects.
 */
export const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const response = await API.get<IProduct[]>('/products');
        return response.data;
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
        const response = await API.post<IProduct>('/products', newProduct);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

// You would add updateProduct, deleteProduct, and movement endpoints here as needed