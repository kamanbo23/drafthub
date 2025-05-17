import React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  useTheme 
} from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  const theme = useTheme();
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, textAlign: 'left', fontWeight: 'bold' }}
          >
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              NBA Draft Hub
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/big-board">Big Board</Button>
          <Button color="inherit" component={Link} to="/data-viz">Data Viz</Button>
          <Button color="inherit" component={Link} to="/projection">Projections</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;