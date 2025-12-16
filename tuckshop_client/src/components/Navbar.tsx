import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  useMediaQuery, 
  useTheme,
  IconButton, // <-- NEW
  Menu,       // <-- NEW
  MenuItem    // <-- NEW
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom'; // <-- Add useNavigate for menu closing logic

const Navbar: React.FC = () => {
  const theme = useTheme();
  // Check if screen is small (mobile size)
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use 'md' for slightly more room for the desktop view
  
  // State to handle the opening and closing of the mobile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // Hook to change routes

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'POS', path: '/pos' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Admin', path: '/admin' },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleClose(); // Close the menu
    navigate(path); // Navigate to the new path
  };

  return (
    <AppBar position="fixed" sx={{ height: 64 }}> 
      <Toolbar>
        {/* Title/Logo: Can also be a button linking to the dashboard */}
        <Typography 
          variant="h6" 
          color="inherit"
          sx={{ flexGrow: 1, textDecoration: 'none', cursor: 'pointer' }} 
          component={Link} 
          to="/"
        >
          TuckShop App
        </Typography>
        
        {isMobile ? (
          // --- MOBILE VIEW (Burger Icon and Dropdown) ---
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon /> {/* The stylish burger icon */}
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ mt: '45px' }} // Position the menu nicely below the AppBar
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          // --- DESKTOP VIEW (Horizontal Buttons) ---
          <Box>
            {navItems.map((item) => (
              <Button key={item.name} color="inherit" component={Link} to={item.path}>
                {item.name}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;