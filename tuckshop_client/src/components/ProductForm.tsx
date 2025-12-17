// tuckshop_client/src/components/ProductForm.tsx (FULL CODE - Updated for Edit/Update)

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, MenuItem, Grid, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { IProduct, ICreateProduct } from '../types/Product';
import type { ICategory } from '../types/Category';
import { createProduct, updateProduct } from '../api/productAPI'; // <-- Uses productAPI.ts and imports updateProduct
import { getAllCategories } from '../api/categoryAPI'; // <-- Uses categoryAPI.ts

// Define the required props for the Product Form (now supports optional initial data)
interface ProductFormProps {
    initialProduct?: IProduct | null; // <-- Data for editing
    onProductSaved: (product: IProduct) => void; // <-- New generic save handler
    onClose: () => void;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

const initialFormData: ICreateProduct = {
    name: '',
    description: null,
    price: 0, 
    stocklevel: 0,
    categoryid: 0, 
};

// Helper function to convert IProduct to ICreateProduct structure for the form state
const productToFormData = (product: IProduct): ICreateProduct => ({
    name: product.name,
    description: product.description || null,
    price: product.price,
    stocklevel: product.stocklevel,
    categoryid: product.categoryid,
});

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onProductSaved, onClose, onError, onSuccess }) => {
    const isEditing = Boolean(initialProduct);
    const [formData, setFormData] = useState<ICreateProduct>(isEditing && initialProduct ? productToFormData(initialProduct) : initialFormData);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [formError, setFormError] = useState<string | null>(null);

    // Fetch Categories for the Dropdown and set initial data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getAllCategories();
                setCategories(cats);
                
                setFormData(prev => {
                    // If creating, set default to first category if none is selected
                    if (!isEditing && prev.categoryid === 0 && cats.length > 0) {
                        return { ...prev, categoryid: cats[0].categoryid };
                    }
                    // If editing, ensure the category is set even if not the first one
                    if (isEditing && initialProduct && prev.categoryid === 0) {
                         return { ...prev, categoryid: initialProduct.categoryid };
                    }
                    return prev;
                });
            } catch (err) {
                onError('Failed to load categories for the form dropdown.');
            }
        };
        fetchCategories();
    }, [onError, isEditing, initialProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' && !isNaN(parseFloat(value)) ? parseFloat(value) : value,
        } as ICreateProduct));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);
        onError('');
        onSuccess('');

        if (!formData.name || formData.categoryid === 0 || formData.price <= 0) {
            setFormError('Please fill out all required fields and ensure price is greater than zero.');
            setLoading(false);
            return;
        }
        
        if (formData.stocklevel < 0) {
            setFormError('Stock level cannot be negative. Must be 0 or greater.');
            setLoading(false);
            return;
        }

        try {
            let savedProduct: IProduct;
            
            if (isEditing && initialProduct) {
                // UPDATE LOGIC
                savedProduct = await updateProduct(initialProduct.productid, formData);
                onSuccess(`Product "${savedProduct.name}" updated successfully!`);
            } else {
                // CREATE LOGIC
                savedProduct = await createProduct(formData);
                onSuccess(`Product "${savedProduct.name}" created successfully!`);
            }
            
            onProductSaved(savedProduct); // Handler for both success cases
            
        } catch (err: any) {
            console.error('Product save failed:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
            setFormError(`Failed to ${isEditing ? 'update' : 'create'} product: ${errorMessage}`);
            onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const title = isEditing ? `Edit Product: ${initialProduct?.name}` : 'Add New Product';
    const submitLabel = isEditing ? 'Save Changes' : 'Create Product';

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            
            {formError && <Box sx={{ mb: 2 }}><Typography color="error">{formError}</Typography></Box>}

            <Grid container spacing={2}>
                {/* Reverting to your specific Grid syntax */}
                <Grid size={{ xs: 12, sm: 6 }}> 
                    <TextField
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        label="Category"
                        name="categoryid"
                        value={formData.categoryid || ''}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.categoryid} value={cat.categoryid}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        multiline
                        rows={2}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Price (R)"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ step: "0.01" }}
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Stock Level"
                        name="stocklevel"
                        value={formData.stocklevel || ''}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ min: 0 }}
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        helperText="Must be 0 or greater"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    disabled={loading}
                >
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;