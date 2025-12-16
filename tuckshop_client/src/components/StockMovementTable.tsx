// tuckshop_client/src/components/StockMovementTable.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import ResponsiveTable from './ResponsiveTable';
import { getStockMovementHistory } from '../api/stockAPI';
import type { IStockMovement } from '../types/Stock';

// Define columns for Stock Movement data
const movementColumns = [
    { key: 'movementid' as const, label: 'ID' },
    { key: 'product_name' as const, label: 'Product' },
    { key: 'quantity_change' as const, label: 'Change' },
    { key: 'reason' as const, label: 'Reason' },
    { key: 'timestamp' as const, label: 'Date/Time' },
];

interface StockMovementTableProps {
    // We can add a refresh trigger later if manual adjustments are needed
}

const StockMovementTable: React.FC<StockMovementTableProps> = () => {
    const [movements, setMovements] = useState<IStockMovement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMovements = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getStockMovementHistory();
            setMovements(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load stock movement history. Check server connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);
    
    // Prepare data for the generic table
    const tableData = movements.map(m => {
        const timestamp = new Date(m.timestamp).toLocaleString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        return {
            ...m,
            timestamp,
            quantity_change: m.quantity_change,
            id: m.movementid
        };
    });


    return (
        <Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            
            {!loading && error && (
                <Alert severity="error">{error}</Alert>
            )}

            {!loading && !error && (
                <ResponsiveTable<IStockMovement & { id: number }>
                    columns={movementColumns}
                    data={tableData}
                    loading={false}
                    error={null}
                    idKey={'movementid'}
                    // Since this is read-only history, no edit/delete buttons are needed
                    onEdit={() => {}} 
                    onDelete={() => {}}
                />
            )}
            
            {!loading && !error && movements.length === 0 && (
                <Alert severity="info">No stock movement records found.</Alert>
            )}
        </Box>
    );
};

export default StockMovementTable;