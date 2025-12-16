import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toolbar, Box, Typography } from '@mui/material';

// --- Page Imports ---
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import POSPage from './pages/POSPage';
import AdminPage from './pages/AdminPage';

// --- Component Imports (The Navbar component is now its own file) ---
import Navbar from './components/Navbar'; 

// Define the height of the AppBar for consistent spacing
const APP_BAR_HEIGHT = 64; 

const App: React.FC = () => {
  return (
    <Router>
      {/* 1. The Fixed Navbar Component */}
      <Navbar />
      
      {/* 2. Spacer to push content down by the height of the fixed Navbar */}
      <Toolbar sx={{ height: APP_BAR_HEIGHT }} /> 
      
      {/* 3. Main Content Box: Ensures content fills the remaining screen space */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0, 
          // Calculate remaining vertical height after the Navbar
          minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)` 
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Typography variant="h2" sx={{ m: 4 }}>404 Not Found</Typography>} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;