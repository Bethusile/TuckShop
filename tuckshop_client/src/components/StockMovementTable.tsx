// tuckshop_client/src/components/StockMovementTable.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, 
    DialogActions, Button, TextField, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Typography, useTheme, useMediaQuery 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
    getStockMovementHistory, 
    updateMovementReason, 
    processRefund,
    processPurchaseReturn
} from '../api/stockAPI';
import type { IStockMovement } from '../types/Stock';

// Define columns for Stock Movement data
const movementColumns = [
    { key: 'movementid' as const, label: 'ID' },
    { key: 'product_name' as const, label: 'Product' },
    { key: 'movementtype' as const, label: 'Type' },
    { key: 'quantity_change' as const, label: 'Change' },
    { key: 'reason' as const, label: 'Reason' },
    { key: 'timestamp' as const, label: 'Date/Time' },
];

interface StockMovementTableProps {
    searchTerm?: string;
    refreshTrigger?: number;
}

const StockMovementTable: React.FC<StockMovementTableProps> = ({ searchTerm = '', refreshTrigger }) => {
    const [movements, setMovements] = useState<IStockMovement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Date filter state
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingMovement, setEditingMovement] = useState<IStockMovement | null>(null);
    const [editReason, setEditReason] = useState('');

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
    }, [fetchMovements, refreshTrigger]);
    
    // Handle edit - only for reason field
    const handleEdit = (movement: IStockMovement & { id: number }) => {
        setEditingMovement(movement);
        setEditReason(movement.reason || '');
        setEditDialogOpen(true);
    };

    const handleSaveReason = async () => {
        if (!editingMovement) return;
        
        try {
            await updateMovementReason(editingMovement.movementid, editReason);
            setEditDialogOpen(false);
            fetchMovements();
            alert('Reason updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update reason. Please try again.');
        }
    };

    // Handle refund for SALE movements
    const handleRefund = async (movement: IStockMovement & { id: number }) => {
        const reason = prompt('Enter refund reason:');
        if (!reason) return;
        
        try {
            await processRefund(movement.movementid, reason);
            fetchMovements();
            alert('Refund processed successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to process refund. Please try again.');
        }
    };

    // Handle return for PURCHASE movements
    const handleReturn = async (movement: IStockMovement & { id: number }) => {
        const reason = prompt('Enter return reason:');
        if (!reason) return;
        
        try {
            await processPurchaseReturn(movement.movementid, reason);
            fetchMovements();
            alert('Return processed successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to process return. Please try again.');
        }
    };
    
    // Prepare data for the generic table
    const tableData = movements.map(m => {
        const rawTimestamp = (m as unknown as { movementtimestamp?: string }).movementtimestamp || m.timestamp;
        const rawQuantityChange = (m as unknown as { quantitychange?: number }).quantitychange ?? m.quantity_change;
        
        const timestamp = new Date(rawTimestamp).toLocaleString('en-ZA', {
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
            quantity_change: rawQuantityChange,
            id: m.movementid
        };
    });

    // Filter movements based on search term and date range
    const filteredData = tableData.filter(movement => {
        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesSearch = (
                (movement.product_name && movement.product_name.toLowerCase().includes(search)) ||
                (movement.reason && movement.reason.toLowerCase().includes(search)) ||
                (movement.movementtype && movement.movementtype.toLowerCase().includes(search)) ||
                movement.movementid.toString().includes(search)
            );
            if (!matchesSearch) return false;
        }
        
        // Date filter
        const rawTimestamp = (movement as unknown as { movementtimestamp?: string }).movementtimestamp || movement.timestamp;
        const movementDate = new Date(rawTimestamp);
        
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (movementDate < start) return false;
        }
        
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (movementDate > end) return false;
        }
        
        return true;
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Stock Movement History', 14, 20);
        
        // Add date range if filtered
        doc.setFontSize(10);
        let yPos = 30;
        if (startDate || endDate) {
            const dateRange = `Date Range: ${startDate || 'Start'} to ${endDate || 'End'}`;
            doc.text(dateRange, 14, yPos);
            yPos += 7;
        }
        
        // Prepare table data
        const tableData = filteredData.map(m => [
            m.movementid,
            m.product_name,
            m.movementtype,
            m.quantity_change,
            m.reason || '-',
            m.timestamp
        ]);
        
        // Generate table
        autoTable(doc, {
            head: [['ID', 'Product', 'Type', 'Change', 'Reason', 'Date/Time']],
            body: tableData,
            startY: yPos,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [63, 81, 181] }
        });
        
        // Save PDF
        const fileName = `stock-movements-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <Box>
            {/* Date Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ minWidth: 150 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ minWidth: 150 }}
                />
                {(startDate || endDate) && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => {
                            setStartDate('');
                            setEndDate('');
                        }}
                    >
                        Clear Dates
                    </Button>
                )}
                <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={filteredData.length === 0}
                >
                    Download PDF
                </Button>
            </Box>
            
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            
            {!loading && error && (
                <Alert severity="error">{error}</Alert>
            )}

            {!loading && !error && movements.length === 0 && (
                <Alert severity="info">No stock movement records found.</Alert>
            )}

            {!loading && !error && movements.length > 0 && (
                isMobile ? (
                    // Mobile View
                    <Box component={Paper} sx={{ p: 2 }}>
                        {filteredData.map((movement) => (
                            <Box key={movement.movementid} sx={{ mb: 2, p: 2, borderBottom: '1px solid #eee' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                    #{movement.movementid} - {movement.product_name}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="textSecondary">Type:</Typography>
                                    <Typography variant="body2">{movement.movementtype}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="textSecondary">Change:</Typography>
                                    <Typography variant="body2">{movement.quantity_change}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="textSecondary">Reason:</Typography>
                                    <Typography variant="body2">{movement.reason || '-'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="textSecondary">Date/Time:</Typography>
                                    <Typography variant="body2">{movement.timestamp}</Typography>
                                </Box>
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button 
                                        size="small" 
                                        startIcon={<EditIcon />} 
                                        color="info" 
                                        onClick={() => handleEdit(movement)}
                                        sx={{ minWidth: 30 }}
                                    />
                                    {movement.movementtype === 'SALE' && (
                                        <Button 
                                            size="small" 
                                            startIcon={<UndoIcon />} 
                                            color="warning" 
                                            onClick={() => handleRefund(movement)}
                                            sx={{ minWidth: 30 }}
                                        />
                                    )}
                                    {movement.movementtype === 'PURCHASE' && (
                                        <Button 
                                            size="small" 
                                            startIcon={<UndoIcon />} 
                                            color="warning" 
                                            onClick={() => handleReturn(movement)}
                                            sx={{ minWidth: 30 }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    // Desktop View
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                    {movementColumns.map((column) => (
                                        <TableCell key={String(column.key)} sx={{ fontWeight: 'bold' }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ fontWeight: 'bold', width: '180px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((movement) => (
                                    <TableRow key={movement.movementid} hover>
                                        {movementColumns.map((column) => {
                                            const value = movement[column.key];
                                            return (
                                                <TableCell key={String(column.key)}>
                                                    {value !== undefined && value !== null ? String(value) : '-'}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button 
                                                    size="small" 
                                                    startIcon={<EditIcon />} 
                                                    color="info" 
                                                    onClick={() => handleEdit(movement)}
                                                    sx={{ minWidth: { xs: 30, sm: 60 } }}
                                                >
                                                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Edit</Box>
                                                </Button>
                                                {movement.movementtype === 'SALE' && (
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<UndoIcon />} 
                                                        color="warning" 
                                                        onClick={() => handleRefund(movement)}
                                                        sx={{ minWidth: { xs: 30, sm: 60 } }}
                                                    >
                                                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Refund</Box>
                                                    </Button>
                                                )}
                                                {movement.movementtype === 'PURCHASE' && (
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<UndoIcon />} 
                                                        color="warning" 
                                                        onClick={() => handleReturn(movement)}
                                                        sx={{ minWidth: { xs: 30, sm: 60 } }}
                                                    >
                                                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Return</Box>
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}

            {/* Edit Reason Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Movement Reason</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveReason} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StockMovementTable;