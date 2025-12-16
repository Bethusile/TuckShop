import React from 'react';
import { Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionButtonsProps {
  itemId: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ itemId, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button 
        size="small" 
        startIcon={<EditIcon />} 
        color="info" 
        onClick={() => onEdit(itemId)}
        // Responsive: Hide text on small screens
        sx={{ minWidth: { xs: 30, sm: 60 } }} 
      >
        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Edit</Box>
      </Button>
      <Button 
        size="small" 
        startIcon={<DeleteIcon />} 
        color="error" 
        onClick={() => onDelete(itemId)}
        sx={{ minWidth: { xs: 30, sm: 60 } }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Delete</Box>
      </Button>
    </Box>
  );
};

export default ActionButtons;