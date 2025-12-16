// tuckshop_client/src/pages/DashboardPage.tsx

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        TuckShop Dashboard
      </Typography>
      <Box sx={{ p: 3, border: '1px dashed grey' }}>
        {/* Low Stock Alerts and Sales Metrics will go here */}
        <Typography variant="body1">Operations Overview and Key Metrics</Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;