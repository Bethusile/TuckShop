// tuckshop_client/src/components/ProductTable.tsx (FULL CODE - Updated for Edit Handler)

import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveTable from './ResponsiveTable';
import { getAllProducts, deleteProduct } from '../api/productAPI'; // <-- Uses productAPI.ts
import type { IProduct } from '../types/Product';
import { Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ProductTableProps {
    refreshTrigger: number;
    onAddClick: () => void;
    onEditClick: (product: IProduct) => void; // <-- NEW: Handler to start editing
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

const productColumns = [
    { key: 'productid' as const, label: 'ID' },
    { key: 'name' as const, label: 'Product Name' },
    { key: 'stocklevel' as const, label: 'Stock' },
    { 
        key: 'price' as const, 
        label: 'Price',
        render: (product: IProduct) => {
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            return `R${price.toFixed(2)}`;
        }
    },
    { 
        key: 'category_name' as const, 
        label: 'Category',
        render: (product: IProduct) => product.category_name || 'N/A' 
    },
];

const ProductTable: React.FC<ProductTableProps> = ({ refreshTrigger, onAddClick, onEditClick, onError, onSuccess }) => { // <-- Accept onEditClick
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load products. Check server connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshTrigger]);

    // --- UPDATED: HANDLE EDIT ---
    const handleEdit = (id: number | string) => {
        const productToEdit = products.find(p => p.productid === Number(id));
        if (productToEdit) {
            onEditClick(productToEdit); // Pass the entire product object up
        } else {
             onError(`Could not find product with ID ${id} to edit.`);
        }
    };
    
    const handleDelete = async (id: number | string) => {
        const productId = Number(id);
        if (!window.confirm(`Are you sure you want to delete product ID ${productId}?`)) {
            return;
        }

        onError('');
        onSuccess('');

        try {
            await deleteProduct(productId);
            setProducts(prevProducts => 
                prevProducts.filter(p => p.productid !== productId)
            );
            onSuccess(`Product ID ${productId} deleted successfully.`);
        } catch (err) {
            onError(`Failed to delete product ID ${productId}.`);
        }
    };

    const tableData = products.map(p => ({ 
        ...p, 
        id: p.productid 
    })) as Array<IProduct & { id: number }>;

    return (
        <Box>
            <Box sx={{ mb: 2, textAlign: 'right' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={onAddClick}
                >
                    Add New Product
                </Button>
            </Box>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            
            {!loading && (
                <ResponsiveTable<IProduct & { id: number }>
                    columns={productColumns}
                    data={tableData}
                    loading={false}
                    error={error}
                    onEdit={handleEdit} // Pass updated handleEdit
                    onDelete={handleDelete}
                    idKey={'productid'}
                />
            )}
        </Box>
    );
};

export default ProductTable;