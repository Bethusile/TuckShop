// tuckshop_client/src/pages/DashboardPage.tsx (FINALIZED FOR REAL DATA)

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Box, Paper, CircularProgress, 
    Alert, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

// --- NEW/VERIFIED IMPORTS ---
import SearchFilterSort from '../components/SearchFilterSort';
import { getDashboardMetrics } from '../api/dashboardAPI';
import type { IDashboardData } from '../api/dashboardAPI';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import WarningIcon from '@mui/icons-material/Warning';
import ChecklistIcon from '@mui/icons-material/Checklist';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


// NOTE: Assuming IDashboardData is correctly imported from dashboardAPI.ts

const DashboardPage: React.FC = () => {
    // Retain existing state for search term
    const [searchTerm, setSearchTerm] = useState('');
    
    // New state for dashboard data
    const [data, setData] = useState<IDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // --- ACTUAL API CALL IMPLEMENTED HERE ---
            const metrics = await getDashboardMetrics();
            // --- MOCK DATA REMOVED ---

            setData(metrics);
            setError(null);
        } catch (err) {
            console.error(err);
            // Updated error message to reflect expected API failure
            setError('Failed to load dashboard data. Ensure the server is running and the /dashboard/metrics endpoint is correct.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

    // --- KPI Card Component (Inline) ---
    const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
        <Card elevation={2} sx={{ borderLeft: `5px solid ${color}` }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ color, p: 1, borderRadius: '50%', bgcolor: `${color}10` }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    // --- Render Logic ---
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                TuckShop Dashboard
            </Typography>
            
            {/* RETAINED: SearchFilterSort Component */}
            <Box sx={{ mb: 3 }}>
                <SearchFilterSort
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search metrics and reports..."
                />
            </Box>
            
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
            
            {!loading && error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {!loading && data && (
                <Box>
                    {/* --- A. Key Performance Indicators (KPIs) --- */}
                    <Box>
                        <Typography variant="h5" sx={{ mb: 2 }}>Key Metrics Overview</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {/* KPI 1: Revenue Today */}
                            <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
                                <KpiCard
                                    title="Revenue Today"
                                    value={formatCurrency(data.totalRevenueToday)}
                                    icon={<AttachMoneyIcon sx={{ fontSize: 30 }} />}
                                    color="#4caf50"
                                />
                            </Box>
                            {/* KPI 2: Transactions Today */}
                            <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
                                <KpiCard
                                    title="Transactions Today"
                                    value={data.totalTransactionsToday}
                                    icon={<ShoppingCartIcon sx={{ fontSize: 30 }} />}
                                    color="#2196f3"
                                />
                            </Box>
                            {/* KPI 3: Total Inventory Value */}
                            <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
                                <KpiCard
                                    title="Total Inventory Value"
                                    value={formatCurrency(data.totalInventoryValue)}
                                    icon={<CategoryIcon sx={{ fontSize: 30 }} />}
                                    color="#ff9800"
                                />
                            </Box>
                            {/* KPI 4: Active Categories */}
                            <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
                                <KpiCard
                                    title="Active Categories"
                                    value={data.categoryCount}
                                    icon={<ChecklistIcon sx={{ fontSize: 30 }} />}
                                    color="#9c27b0"
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* --- B & C. Status & Workflow --- */}
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {/* Low Stock Alerts */}
                            <Box sx={{ flex: '1 1 320px', minWidth: 320 }}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom color="error">
                                        <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Low Stock Alerts ({data.lowStockItems.length})
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    {data.lowStockItems.length === 0 ? (
                                        <Alert severity="success">All items are above safety level.</Alert>
                                    ) : (
                                        <List dense sx={{ maxHeight: 250, overflowY: 'auto' }}>
                                            {data.lowStockItems.map(item => (
                                                <ListItem key={item.productid}>
                                                    <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                                                    <ListItemText primary={item.name} secondary={`Stock: ${item.stock} (Safety: ${item.safety_level})`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </Paper>
                            </Box>

                            {/* Most Popular Item */}
                            <Box sx={{ flex: '1 1 320px', minWidth: 320 }}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Most Popular Item (Last 30 Days)
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    {data.mostPopularItem ? (
                                        <Box>
                                            <Typography variant="h4" color="primary">{data.mostPopularItem.product_name}</Typography>
                                            <Typography variant="body1" color="text.secondary">{data.mostPopularItem.quantity_sold} Units Sold</Typography>
                                        </Box>
                                    ) : (
                                        <Alert severity="info">No recent sales data.</Alert>
                                    )}
                                </Paper>
                            </Box>
                            
                            {/* Operational Workflow */}
                            <Box sx={{ flex: '1 1 320px', minWidth: 320 }}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Application Workflow</Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <List dense>
                                        <ListItem><ListItemText primary="1. Inventory Setup" secondary="Categories and Products defined in Admin." /></ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="2. POS Sale" 
                                                secondary="Sale processed on POS, instantly deducting stock." 
                                            /> 
                                            
                                        </ListItem>
                                        <ListItem><ListItemText primary="3. Audit & Reporting" secondary="Stock movements logged for history and KPIs displayed here." /></ListItem>
                                    </List>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default DashboardPage;