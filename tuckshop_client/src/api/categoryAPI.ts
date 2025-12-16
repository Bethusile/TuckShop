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

/**
 * Updates an existing category.
 * @param id The ID of the category to update.
 * @param updatedCategory The new category data (e.g., { name: "Drinks" }).
 * @returns A promise resolving to the updated ICategory object.
 */
export const updateCategory = async (id: number, updatedCategory: ICreateCategory): Promise<ICategory> => {
    try {
        const response = await API.put<ICategory>(`/categories/${id}`, updatedCategory);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ID ${id}:`, error);
        throw error;
    }
};

/**
 * Deletes a category by ID.
 * @param id The ID of the category to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteCategory = async (id: number): Promise<void> => {
    try {
        await API.delete(`/categories/${id}`);
    } catch (error: any) {
        // --- LOGIC TO PREVENT DELETE ANOMALY ---
        const status = error.response?.status;
        
        // Assuming backend returns 409 Conflict or 400 Bad Request for FK violation
        if (status === 409 || status === 400) { 
            // This is a common pattern for constraint violation errors
            throw new Error(
                "Cannot delete category: Items are currently linked to it. Please reassign all items to another category first."
            );
        }
        
        console.error(`Error deleting category ID ${id}:`, error);
        throw error; // Re-throw any other generic error
    }
};