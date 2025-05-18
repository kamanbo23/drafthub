import React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Button, 
  useTheme 
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../public/logo.png'; // easier than using the import alias

// Basic navbar with links to main pages
// Note: need to add mobile menu at some point
function Navbar() {
  // get theme for consistent colors
  const theme = useTheme();
  
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
          {/* Logo on the left */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={logo} 
                alt="Mavs Logo" 
                style={{ height: '40px' }} 
              />
            </Link>
          </Box>
          
          {/* Nav links - kinda messy but works */}
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/big-board">Big Board</Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/data-viz"
          >
            Data Viz
          </Button>
          <Button color="inherit" component={Link} to="/projection">AI Projections</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;