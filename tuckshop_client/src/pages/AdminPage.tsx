// tuckshop_client/src/pages/AdminPage.tsx (FULL CODE - Updated for Category Edit/Modal)

import React, { useState, useCallback, useEffect } from 'react';
import { Container, Typography, Box, Paper, Divider, Modal, Button } from '@mui/material';
import { getAllCategories } from '../api/categoryAPI';
import { getStockMovementHistory } from '../api/stockAPI';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
import StockMovementTable from '../components/StockMovementTable';
import FeedbackAlert from '../components/FeedbackAlert';
import SearchFilterSort from '../components/SearchFilterSort';
import type { ICategory } from '../types/Category';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const AdminPage: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    // --- NEW STATE FOR EDITING ---
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    
    // Search states
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [stockSearchTerm, setStockSearchTerm] = useState('');
    
    // Count states
    const [categoryCount, setCategoryCount] = useState(0);
    const [stockMovementCount, setStockMovementCount] = useState(0);

    // Fetch counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [categories, movements] = await Promise.all([
                    getAllCategories(),
                    getStockMovementHistory()
                ]);
                setCategoryCount(categories.length);
                setStockMovementCount(movements.length);
            } catch (error) {
                console.error('Failed to fetch counts:', error);
            }
        };
        fetchCounts();
    }, [refreshTrigger]);

    // Handlers for the reusable alert component
    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
        setSuccessMessage('');
    }, []);

    const handleSuccess = useCallback((message: string) => {
        setSuccessMessage(message);
        setErrorMessage('');
    }, []);
    
    // Handler passed to CategoryForm for both Create and Update success
    const handleCategorySaved = (_savedCategory: ICategory) => {
        setRefreshTrigger(prev => prev + 1); // Trigger CategoryTable refetch
    };

    // --- MODAL HANDLERS ---
    const handleOpenEdit = (category: ICategory) => {
        setCategoryToEdit(category);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setCategoryToEdit(null);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin & Settings
            </Typography>

            {/* Sticky Navigation Buttons */}
            <Box 
                sx={{ 
                    position: 'sticky', 
                    top: 64, 
                    zIndex: 10, 
                    backgroundColor: 'background.default',
                    py: 2,
                    mb: 2,
                    display: 'flex',
                    gap: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Button 
                    variant="contained" 
                    onClick={() => document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    sx={{ minWidth: 120 }}
                >
                    Categories
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => document.getElementById('stock-movement-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    sx={{ minWidth: 120 }}
                >
                    Stock Movements
                </Button>
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

            {/* --- Category Management Section --- */}
            <Box id="category-section" component={Paper} elevation={3} sx={{ p: 3, mb: 4, scrollMarginTop: 100 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Category Management</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                    </Typography>
                </Box>
                
                {/* Category Creation Form (Inline use of CategoryForm) */}
                <Box sx={{ mb: 3 }}>
                    <CategoryForm 
                        initialCategory={null} // Force CREATE mode
                        onCategorySaved={handleCategorySaved}
                        onClose={() => { /* No-op for inline form */ }} 
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <SearchFilterSort
                    searchValue={categorySearchTerm}
                    onSearchChange={setCategorySearchTerm}
                    searchPlaceholder="Search categories..."
                />

                {/* Category List/Table */}
                <CategoryTable
                    searchTerm={categorySearchTerm} 
                    refreshTrigger={refreshTrigger}
                    onEditClick={handleOpenEdit} // <-- Pass Edit handler
                    onError={handleError}
                    onSuccess={handleSuccess}
                />
            </Box>

            {/* --- Category Edit Modal --- */}
            <Modal open={openEditModal} onClose={handleCloseEditModal}>
                <Paper sx={modalStyle}>
                    <CategoryForm 
                        initialCategory={categoryToEdit} // Pass the category data
                        onCategorySaved={handleCategorySaved}
                        onClose={handleCloseEditModal}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Paper>
            </Modal>


            {/* --- Stock Movement Section --- */}
            <Box id="stock-movement-section" component={Paper} elevation={3} sx={{ p: 3, scrollMarginTop: 100 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Stock Movement History (Sales & Adjustments)</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {stockMovementCount} {stockMovementCount === 1 ? 'record' : 'records'}
                    </Typography>
                </Box>
                
                <SearchFilterSort
                    searchValue={stockSearchTerm}
                    onSearchChange={setStockSearchTerm}
                    searchPlaceholder="Search stock movements..."
                />
                
                {/* Integration of the new Stock Movement Table */}
                <StockMovementTable searchTerm={stockSearchTerm} />
            </Box>
        </Container>
    );
};

export default AdminPage;