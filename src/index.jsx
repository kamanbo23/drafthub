import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0053a0',
    },
    secondary: {
      main: '#00843d', 
    },
  },
  typography: {
    h1: {
      color: '#0053a0',
    },
    h2: {
      color: '#0053a0',
    },
    h3: {
      color: '#0053a0',
    },
    h4: {
      color: '#0053a0',
    },
    h5: {
      color: '#0053a0',
    },
    h6: {
      color: '#0053a0',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
); 