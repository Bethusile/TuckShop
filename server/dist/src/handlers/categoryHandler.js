"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.createCategoryHandler = exports.getCategoryByIdHandler = exports.getAllCategoriesHandler = void 0;
const categoryService = __importStar(require("../services/categoryService"));
// GET all categories
const getAllCategoriesHandler = async (req, res) => {
    try {
        const categories = await categoryService.fetchAllCategories();
        res.json(categories);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
};
exports.getAllCategoriesHandler = getAllCategoriesHandler;
// GET one category
const getCategoryByIdHandler = async (req, res) => {
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
        }
        else {
            res.json(category);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve category.' });
    }
};
exports.getCategoryByIdHandler = getCategoryByIdHandler;
// POST create category
const createCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Category name is required.' });
            return;
        }
        const newCategory = await categoryService.createCategory(name);
        res.status(201).json(newCategory);
    }
    catch (err) {
        // Catch PostgreSQL unique constraint error if category name already exists
        if (err.code === '23505') {
            res.status(409).json({ error: 'Category name already exists.' });
        }
        else {
            console.error(err);
            res.status(500).json({ error: 'Failed to create category.' });
        }
    }
};
exports.createCategoryHandler = createCategoryHandler;
// PUT update category
const updateCategoryHandler = async (req, res) => {
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
        }
        else {
            res.json({ message: 'Category updated successfully.' });
        }
    }
    catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ error: 'Category name already exists.' });
        }
        else {
            console.error(err);
            res.status(500).json({ error: 'Failed to update category.' });
        }
    }
};
exports.updateCategoryHandler = updateCategoryHandler;
// DELETE category
const deleteCategoryHandler = async (req, res) => {
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
        }
        else {
            res.json({ message: 'Category deleted successfully (associated products set to NULL).' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete category.' });
    }
};
exports.deleteCategoryHandler = deleteCategoryHandler;
//# sourceMappingURL=categoryHandler.js.map