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
  useMediaQuery,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StraightenIcon from '@mui/icons-material/Straighten';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Link } from 'react-router-dom';

// Illinois Basketball Analytics Navbar
function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const linkStyle = { 
    color: 'inherit', 
    textDecoration: 'none' 
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#e84a27' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <img 
                src="/logo.png" 
                alt="Illinois Basketball Logo" 
                style={{ height: '40px', marginRight: '12px' }} 
              />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                  Illinois Basketball
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                  Analytics Platform
                </Typography>
              </Box>
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
                <MenuItem onClick={handleMenuClose} component={Link} to="/">
                  <SportsBasketballIcon sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>

                <MenuItem onClick={handleMenuClose} component={Link} to="/scouting">
                  <SearchIcon sx={{ mr: 1 }} />
                  Scouting
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/comparison">
                  <CompareArrowsIcon sx={{ mr: 1 }} />
                  Comparison
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/lineup-builder">
                  <GroupsIcon sx={{ mr: 1 }} />
                  Lineup Builder
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/team-analytics">
                  <AnalyticsIcon sx={{ mr: 1 }} />
                  Team Analytics
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/data-viz">
                  <StraightenIcon sx={{ mr: 1 }} />
                  Measurements
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/hs-leaders">
                  <LeaderboardIcon sx={{ mr: 1 }} />
                  HS Leaders
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/projection">
                  <PsychologyIcon sx={{ mr: 1 }} />
                  Player Projections
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/" startIcon={<SportsBasketballIcon />}>
                Dashboard
              </Button>

              <Button color="inherit" component={Link} to="/scouting" startIcon={<SearchIcon />}>
                Scouting
              </Button>
              <Button color="inherit" component={Link} to="/comparison" startIcon={<CompareArrowsIcon />}>
                Comparison
              </Button>
              <Button color="inherit" component={Link} to="/lineup-builder" startIcon={<GroupsIcon />}>
                Lineup Builder
              </Button>
              <Button color="inherit" component={Link} to="/team-analytics" startIcon={<AnalyticsIcon />}>
                Team Analytics
              </Button>
              <Button color="inherit" component={Link} to="/data-viz" startIcon={<StraightenIcon />}>
                Measurements
              </Button>
              <Button color="inherit" component={Link} to="/hs-leaders" startIcon={<LeaderboardIcon />}>
                HS Leaders
              </Button>
              <Button color="inherit" component={Link} to="/projection" startIcon={<PsychologyIcon />}>
                Player Projections
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;