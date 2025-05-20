import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Button, 
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

// Basic navbar with links to main pages
// Uses expandable menu on mobile devices
function Navbar() {
  // get theme for consistent colors
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // tried to use styled components here but ran into issues
  // sticking with sx prop for now
  const linkStyle = { 
    color: 'inherit', 
    textDecoration: 'none' 
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Mavs Logo" 
                style={{ height: '40px' }} 
              />
            </Link>
          </Box>
          
          {isMobile ? (
            <Box>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/">Home</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/big-board">Big Board</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/data-viz">Data Viz</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/projection">AI Projections</MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/big-board">Big Board</Button>
              <Button color="inherit" component={Link} to="/data-viz">Data Viz</Button>
              <Button color="inherit" component={Link} to="/projection">AI Projections</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;