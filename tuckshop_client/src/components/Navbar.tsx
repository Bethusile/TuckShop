import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  useMediaQuery, 
  useTheme,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
    handleClose();
    navigate(path);
  };

  return (
    <AppBar position="fixed" sx={{ height: 64 }}> 
      <Toolbar sx={{ px: { xs: 2, md: 28 } }}> {/* ← padding on sides */}
        
        {/* Logo + Title */}
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
        >
          <Box
            component="img"
            src="/snackattack_logo.png"
            alt="SnackAttack Logo"
            sx={{ height: 36, width: 'auto' }}
          />
          <Typography
            variant="h6"
            color="white"
            sx={{ textDecoration: 'none' }}
          >
            Snack Attack
          </Typography>
        </Box>
        
        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ mt: '45px' }}
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
          // Tighter gap between nav buttons
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {navItems.map((item) => (
              <Button key={item.name} color="inherit" component={Link} to={item.path}
                sx={{ minWidth: 'auto', px: 2 }} // ← tighter padding per button
              >
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