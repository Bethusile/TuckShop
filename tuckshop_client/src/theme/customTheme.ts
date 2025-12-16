// tuckshop_client/src/theme/customTheme.ts

import { createTheme } from '@mui/material/styles';
import { deepOrange, grey } from '@mui/material/colors';

// Define the custom theme settings
const customTheme = createTheme({
  palette: {
    // Primary color will be Deep Orange
    primary: {
      main: deepOrange[700], // A rich, deep orange for buttons and app bar
      light: deepOrange[400],
      dark: deepOrange[900],
    },
    // Secondary color can be a complementary neutral or a light accent
    secondary: {
      main: grey[500],
      light: grey[300],
      dark: grey[700],
    },
    // Background colors should be white or very light grey
    background: {
      default: '#ffffff', // Pure white for main backgrounds
      paper: grey[50], // Slightly off-white for cards/paper elements
    },
    // Text should be dark for readability
    text: {
      primary: grey[900], // Deep grey/black for primary text
      secondary: grey[600],
    },
    // Use the deep orange for success/alerts related to revenue/sales
    success: {
      main: deepOrange[500], 
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    // You can customize fonts and sizes here if needed
  },
  // Customize MUI components to use your new palette
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            // Ensure the App Bar is deep orange
            colorPrimary: {
                backgroundColor: deepOrange[700],
            },
        },
    },
  }
});

export default customTheme;