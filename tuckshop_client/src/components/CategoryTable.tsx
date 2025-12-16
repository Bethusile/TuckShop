// tuckshop_client/src/components/CategoryTable.tsx (FULL CODE - Updated for Edit Handler)

import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveTable from './ResponsiveTable';
import { getAllCategories, deleteCategory } from '../api/categoryAPI';
import type { ICategory } from '../types/Category';
import { Box, CircularProgress } from '@mui/material';

// Define the columns for the Category data
const categoryColumns = [
    { key: 'categoryid' as const, label: 'ID' },
    { key: 'name' as const, label: 'Category Name' },
];

interface CategoryTableProps {
    searchTerm?: string;
    refreshTrigger: number;
    onEditClick: (category: ICategory) => void; // <-- NEW: Handler to start editing
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ searchTerm = '', refreshTrigger, onEditClick, onError, onSuccess }) => { // <-- Accept onEditClick
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load categories. Check server connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, refreshTrigger]);

    // Filter categories based on search term
    const filteredCategories = React.useMemo(() => {
        return categories.filter(category => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return category.name.toLowerCase().includes(search);
        });
    }, [categories, searchTerm]);

    // --- CRUD Handlers ---
    
    // --- UPDATED: HANDLE EDIT ---
    const handleEdit = (id: number | string) => {
        const categoryToEdit = categories.find(c => c.categoryid === Number(id));
        if (categoryToEdit) {
            onEditClick(categoryToEdit); // Pass the category object up
        } else {
             onError(`Could not find category with ID ${id} to edit.`);
        }
    };
    
    // ... handleDelete remains the same ...
    const handleDelete = async (id: number | string) => {
        const categoryId = Number(id);
        if (!window.confirm(`Are you sure you want to delete Category ID ${categoryId}?`)) {
            return;
        }

        onError('');
        onSuccess('');

        try {
            await deleteCategory(categoryId);
            
            // Optimistic Update: Remove the category from the local state
            setCategories(prevCategories => 
                prevCategories.filter(c => c.categoryid !== categoryId)
            );
            onSuccess(`Category ID ${categoryId} deleted successfully.`);
            
        } catch (err: any) {
            console.error(err);
            
            // Check if the error response contains our validation message
            const errorMessage = err?.response?.data?.error || err?.message || 'Failed to delete category.';
            onError(errorMessage);
        }
    };

    // Prepare data for the generic table, ensuring 'id' field is present
    const tableData = filteredCategories.map(c => ({ 
        ...c, 
        id: c.categoryid 
    })) as Array<ICategory & { id: number }>;

    return (
        <Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            
            {!loading && (
                <ResponsiveTable<ICategory & { id: number }>
                    columns={categoryColumns}
                    data={tableData}
                    loading={false}
                    error={error}
                    onEdit={handleEdit} // Pass updated handleEdit
                    onDelete={handleDelete}
                    idKey={'categoryid'}
                />
            )}
        </Box>
    );
};

export default CategoryTable;