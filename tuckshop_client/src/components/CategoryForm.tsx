// tuckshop_client/src/components/CategoryForm.tsx (FULL CODE - Updated for Edit/Update)

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { createCategory, updateCategory } from '../api/categoryAPI'; // <-- Import updateCategory
import type { ICategory } from '../types/Category';

interface CategoryFormProps {
    initialCategory?: ICategory | null; // <-- NEW: Category data for editing
    onCategorySaved: (category: ICategory) => void; // <-- New generic handler
    onClose: () => void; // <-- NEW: Used to close modal after save
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialCategory, onCategorySaved, onClose, onError, onSuccess }) => {
    const isEditing = Boolean(initialCategory);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Effect to set the initial name when entering edit mode
    useEffect(() => {
        if (isEditing && initialCategory) {
            setName(initialCategory.name);
        } else {
            setName('');
        }
    }, [initialCategory, isEditing]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        onError('');
        onSuccess('');

        const trimmedName = name.trim();
        if (!trimmedName) {
            onError('Category name cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            let savedCategory: ICategory;
            
            if (isEditing && initialCategory) {
                // UPDATE LOGIC
                savedCategory = await updateCategory(initialCategory.categoryid, { name: trimmedName });
                onSuccess(`Category "${savedCategory.name}" updated successfully!`);
            } else {
                // CREATE LOGIC
                savedCategory = await createCategory({ name: trimmedName });
                onSuccess(`Category "${savedCategory.name}" created successfully!`);
            }
            
            onCategorySaved(savedCategory); 
            onClose(); // Close the modal (if in modal, otherwise does nothing)
            
        } catch (err) {
            console.error('Category save failed:', err);
            onError(`Failed to ${isEditing ? 'update' : 'create'} category. A category with this name might already exist.`);
        } finally {
            setLoading(false);
        }
    };

    const title = isEditing ? `Edit Category: ${initialCategory?.name}` : 'Add New Category';
    const submitLabel = isEditing ? 'Save Changes' : 'Add Category';

    // The component is now used in two ways: inline for CREATE, and in a MODAL for EDIT
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Show title only when editing inside the modal */}
            {isEditing && <Typography variant="h6" gutterBottom>{title}</Typography>}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    label={isEditing ? "New Name" : "New Category Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isEditing ? <SaveIcon /> : <AddIcon />)}
                    disabled={loading || !name.trim()}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {submitLabel}
                </Button>
            </Box>
             {/* If in edit mode (in modal), add a Cancel button */}
            {isEditing && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                     <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CategoryForm;