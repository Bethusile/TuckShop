import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Collapse, Box } from '@mui/material';

interface FeedbackAlertProps {
  message: string | null;
  severity: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  autoHideDuration?: number; // Duration in milliseconds before it hides
  onClose?: () => void;
}

const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  message,
  severity,
  title,
  autoHideDuration = 5000,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          onClose(); // Optional callback for parent state reset
        }
      }, autoHideDuration);
      return () => clearTimeout(timer); // Cleanup timer
    } else {
      setOpen(false);
    }
  }, [message, autoHideDuration, onClose]);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert 
          severity={severity} 
          onClose={() => { 
            setOpen(false); 
            if (onClose) onClose(); 
          }}
          sx={{ mb: 2 }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default FeedbackAlert;