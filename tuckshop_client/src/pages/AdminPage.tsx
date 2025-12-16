// tuckshop_client/src/pages/AdminPage.tsx (FULL CODE - Updated for Category Edit/Modal)

import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, Paper, Divider, Modal } from '@mui/material';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
import StockMovementTable from '../components/StockMovementTable';
import FeedbackAlert from '../components/FeedbackAlert';
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
            <Box component={Paper} elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Category Management</Typography>
                
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

                {/* Category List/Table */}
                <CategoryTable 
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
            <Box component={Paper} elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Stock Movement History (Sales & Adjustments)</Typography>
                
                {/* Integration of the new Stock Movement Table */}
                <StockMovementTable />
            </Box>
        </Container>
    );
};

export default AdminPage;