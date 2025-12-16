// tuckshop_client/src/api/category.ts

import API from './config';
import type { ICategory, ICreateCategory } from '../types/Category';

/**
 * Fetches all categories from the backend.
 * @returns A promise resolving to an array of ICategory objects.
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
    try {
        const response = await API.get<ICategory[]>('/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        // Throwing the error allows components to handle it (e.g., show a toast)
        throw error;
    }
};

/**
 * Creates a new category.
 * @param newCategory The category data to create.
 * @returns A promise resolving to the created ICategory object.
 */
export const createCategory = async (newCategory: ICreateCategory): Promise<ICategory> => {
    try {
        const response = await API.post<ICategory>('/categories', newCategory);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// You would add updateCategory, deleteCategory here as needed