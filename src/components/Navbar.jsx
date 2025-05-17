import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            NBA Draft Hub
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/big-board">Big Board</Button>
        <Button color="inherit" component={Link} to="/data-viz">Data Visualization</Button>
        <Button color="inherit" component={Link} to="/projection">Player Projections</Button>
      </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;