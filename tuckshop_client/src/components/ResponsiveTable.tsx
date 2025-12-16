import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ActionButtons from './ActionButtons';

// Define the structure of a column
interface Column<T> {
  key: keyof T; // Key in the data object
  label: string; // Header label
  render?: (item: T) => React.ReactNode; // Optional custom renderer (e.g., formatting price)
}

interface ResponsiveTableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  idKey: keyof T; // The key used for the unique ID (e.g., 'categoryid' or 'productid')
}

// NOTE: We use <T extends { id: number | string }> to ensure the data has an ID for keys
const ResponsiveTable = <T extends { id: number | string }>({
  columns,
  data,
  loading,
  error,
  onEdit,
  onDelete,
  idKey
}: ResponsiveTableProps<T>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="primary" /></Box>;
  if (error) return <Typography color="error" sx={{ p: 2 }}>Error: {error}</Typography>;
  if (data.length === 0) return <Typography sx={{ p: 2 }}>No data found.</Typography>;

  // --- MOBILE VIEW (Simpler list) ---
  if (isMobile) {
    return (
      <Box component={Paper} sx={{ p: 2 }}>
        {data.map((item) => (
          <Box key={String(item[idKey])} sx={{ mb: 2, p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {/* Display the main ID/Name for the list header */}
                {String(item[idKey])} - {String(item[columns[1].key])} 
            </Typography>
            {columns.map(col => (
                <Box key={String(col.key)} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">{col.label}:</Typography>
                    <Typography variant="body2">
                        {col.render ? col.render(item) : String(item[col.key])}
                    </Typography>
                </Box>
            ))}
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButtons 
                    itemId={Number(item[idKey])} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }


  // --- DESKTOP VIEW (Full Table) ---
  return (
    <TableContainer component={Paper}>
      <Table aria-label="responsive data table">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
            {columns.map((column) => (
              <TableCell key={String(column.key)} sx={{ fontWeight: 'bold' }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={String(item[idKey])} hover>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(item) : String(item[column.key])}
                </TableCell>
              ))}
              <TableCell>
                <ActionButtons 
                    itemId={Number(item[idKey])} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;