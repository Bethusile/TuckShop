// tuckshop_client/src/main.tsx (Updated)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/style.css'; 
import { CssBaseline, ThemeProvider } from '@mui/material'; // <-- Import ThemeProvider
import customTheme from './theme/customTheme'; // <-- Import your custom theme

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap the entire App in the ThemeProvider */}
    <ThemeProvider theme={customTheme}> 
      <CssBaseline /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);