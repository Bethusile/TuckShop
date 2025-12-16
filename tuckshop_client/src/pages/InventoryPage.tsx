// tuckshop_client/src/pages/InventoryPage.tsx (FULL CODE - Final CRUD)

import React, { useState, useCallback, useEffect } from 'react';
import { Container, Typography, Modal, Paper, Box } from '@mui/material';
import { getAllProducts } from '../api/productAPI';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import FeedbackAlert from '../components/FeedbackAlert';
import SearchFilterSort from '../components/SearchFilterSort';
import type { IProduct } from '../types/Product';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    maxHeight: '90vh',
    overflow: 'auto',
    p: 4,
};

const InventoryPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    // --- NEW STATE FOR EDITING ---
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch total product count
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const products = await getAllProducts();
                setTotalProducts(products.length);
            } catch (error) {
                console.error('Failed to fetch product count:', error);
            }
        };
        fetchCount();
    }, [refreshTrigger]);

    // --- MODAL HANDLERS ---

    const handleOpenCreate = () => {
        setProductToEdit(null); // Clear any old edit data
        setShowAddModal(true);
    };

    const handleOpenEdit = (product: IProduct) => { // <-- New handler for editing
        setProductToEdit(product);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setProductToEdit(null); // Important: Clear data after closing
    };

    // Handler passed to ProductForm for both Create and Update success
    const handleProductSaved = (_savedProduct: IProduct) => {
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
        handleCloseModal(); 
    };

    // --- ALERT HANDLERS ---
    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
        setSuccessMessage('');
    }, []);

    const handleSuccess = useCallback((message: string) => {
        setSuccessMessage(message);
        setErrorMessage('');
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    Product Inventory
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Total: {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                </Typography>
            </Box>

            <FeedbackAlert 
                message={successMessage || null}
                severity="success"
                onClose={() => setSuccessMessage('')}
            />
            
            <FeedbackAlert 
                message={errorMessage || null}
                severity="error"
                onClose={() => setErrorMessage('')}
            />

            <SearchFilterSort
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search products by name or description..."
            />

            <ProductTable
                searchTerm={searchTerm}
                refreshTrigger={refreshTrigger}
                onAddClick={handleOpenCreate} // Use Create handler
                onEditClick={handleOpenEdit} // <-- Pass Edit handler
                onError={handleError}
                onSuccess={handleSuccess}
            />

            <Modal
                open={showAddModal}
                onClose={handleCloseModal}
                aria-labelledby="add-product-modal"
            >
                <Paper sx={style}>
                    <ProductForm
                        // --- PASS DATA TO FORM ---
                        initialProduct={productToEdit} 
                        onProductSaved={handleProductSaved} // Handle both C and U success
                        onClose={handleCloseModal}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Paper>
            </Modal>
        </Container>
    );
};

export default InventoryPage;