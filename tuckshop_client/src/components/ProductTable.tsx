// tuckshop_client/src/components/ProductTable.tsx (FULL CODE - Updated for Edit Handler)

import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveTable from './ResponsiveTable';
import { getAllProducts } from '../api/productAPI'; // <-- Removed deleteProduct import
import type { IProduct } from '../types/Product';
import { Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ProductTableProps {
    searchTerm?: string;
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

const ProductTable: React.FC<ProductTableProps> = ({ searchTerm = '', refreshTrigger, onAddClick, onEditClick, onError, onSuccess }) => { // <-- Accept onEditClick
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

    // Filter products based on search term
    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                product.name.toLowerCase().includes(search) ||
                (product.description && product.description.toLowerCase().includes(search)) ||
                (product.category_name && product.category_name.toLowerCase().includes(search))
            );
        });
    }, [products, searchTerm]);

    // --- UPDATED: HANDLE EDIT ---
    // --- UPDATED: HANDLE EDIT ---
    const handleEdit = (id: number | string) => {
        const productToEdit = products.find(p => p.productid === Number(id));
        if (productToEdit) {
            onEditClick(productToEdit); // Pass the entire product object up
        } else {
             onError(`Could not find product with ID ${id} to edit.`);
        }
    };
    
    // Delete removed - products should not be deleted from inventory

    const tableData = filteredProducts.map(p => ({ 
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
                    onEdit={handleEdit}
                    idKey={'productid'}
                />
            )}
        </Box>
    );
};

export default ProductTable;