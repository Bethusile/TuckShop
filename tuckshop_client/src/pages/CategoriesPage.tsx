// tuckshop_client/src/pages/CategoriesPage.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Container, Typography, Box, Paper, Modal } from '@mui/material';
import { getAllCategories } from '../api/categoryAPI';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
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

const CategoriesPage: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const categories = await getAllCategories();
                setCategoryCount(categories.length);
            } catch (error) {
                console.error('Failed to fetch category count:', error);
            }
        };
        fetchCount();
    }, [refreshTrigger]);

    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
        setSuccessMessage('');
    }, []);

    const handleSuccess = useCallback((message: string) => {
        setSuccessMessage(message);
        setErrorMessage('');
    }, []);

    const handleCategorySaved = (_savedCategory: ICategory) => {
        setRefreshTrigger(prev => prev + 1);
    };

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    Category Management
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Total: {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
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

            <Box component={Paper} elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Create New Category</Typography>

                <Box sx={{ mb: 3 }}>
                    <CategoryForm
                        initialCategory={null}
                        onCategorySaved={handleCategorySaved}
                        onClose={() => { }}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Box>
            </Box>

            <Box component={Paper} elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">All Categories</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Showing {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                    </Typography>
                </Box>

                <SearchFilterSort
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search categories..."
                />

                <CategoryTable
                    searchTerm={searchTerm}
                    refreshTrigger={refreshTrigger}
                    onEditClick={handleOpenEdit}
                    onError={handleError}
                    onSuccess={handleSuccess}
                />
            </Box>

            <Modal open={openEditModal} onClose={handleCloseEditModal}>
                <Paper sx={modalStyle}>
                    <CategoryForm
                        initialCategory={categoryToEdit}
                        onCategorySaved={handleCategorySaved}
                        onClose={handleCloseEditModal}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Paper>
            </Modal>
        </Container>
    );
};

export default CategoriesPage;
