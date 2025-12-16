// server/src/handlers/categoryHandler.ts
import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

// GET all categories
export const getAllCategoriesHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await categoryService.fetchAllCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
};

// GET one category
export const getCategoryByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        
        if (!idParam) {
            res.status(400).json({ error: 'Missing category ID.' });
            return;
        }

        const categoryid = parseInt(idParam, 10);
        if (isNaN(categoryid)) {
            res.status(400).json({ error: 'Invalid category ID provided.' });
            return;
        }

        const category = await categoryService.fetchCategoryById(categoryid);

        if (!category) {
            res.status(404).json({ error: 'Category not found.' });
        } else {
            res.json(category);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve category.' });
    }
};


// POST create category
export const createCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        
        if (!name) {
            res.status(400).json({ error: 'Category name is required.' });
            return;
        }

        const newCategory = await categoryService.createCategory(name);
        res.status(201).json(newCategory);
    } catch (err: any) {
        // Catch PostgreSQL unique constraint error if category name already exists
        if (err.code === '23505') { 
            res.status(409).json({ error: 'Category name already exists.' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Failed to create category.' });
        }
    }
};

// PUT update category
export const updateCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        const { name } = req.body;

        if (!idParam || !name) {
            res.status(400).json({ error: 'Missing category ID or new name.' });
            return;
        }

        const categoryid = parseInt(idParam, 10);
        if (isNaN(categoryid)) {
            res.status(400).json({ error: 'Invalid category ID provided.' });
            return;
        }

        const updatedCount = await categoryService.updateCategory(categoryid, name);

        if (updatedCount === 0) {
            res.status(404).json({ error: 'Category not found.' });
        } else {
            res.json({ message: 'Category updated successfully.' });
        }
    } catch (err: any) {
        if (err.code === '23505') { 
            res.status(409).json({ error: 'Category name already exists.' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Failed to update category.' });
        }
    }
};

// DELETE category
export const deleteCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        
        if (!idParam) {
            res.status(400).json({ error: 'Missing category ID.' });
            return;
        }

        const categoryid = parseInt(idParam, 10);
        if (isNaN(categoryid)) {
            res.status(400).json({ error: 'Invalid category ID provided.' });
            return;
        }

        const deletedCount = await categoryService.deleteCategory(categoryid);
        
        if (deletedCount === 0) {
            res.status(404).json({ error: 'Category not found.' });
        } else {
            res.json({ message: 'Category deleted successfully (associated products set to NULL).' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete category.' });
    }
};