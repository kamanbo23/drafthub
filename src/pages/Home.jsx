import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Container, 
  Box,
  Paper, 
  Card, 
  CardContent,
  CardActions,
  Button,
  useTheme,
  useMediaQuery,
  Grow
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '/logo.png';

// tried different layouts before settling on this one
function Home() {
  // TODO: use this for responsive tweaks later
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animate, setAnimate] = useState(false);
  
  // animation effect - originally had this set to false
  useEffect(() => {
    // add small delay to make it feel more natural
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Container 
      maxWidth="lg" 
      disableGutters={false} 
      sx={{ 
        width: '100%', 
        py: 4, 
        px: { xs: 2, sm: 3 }, 
        // tried a few background options before picking this one
        background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
      }}
    >
      <Grow in={animate} timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img 
              src={logo}
              alt="Mavs Logo" 
              style={{ 
                maxWidth: '200px',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Box>
          <Typography variant="h4" component="h1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to the Mavericks Draft Hub
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            A companion for evaluating NBA Draft prospects
          </Typography>
        </Paper>
      </Grow>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{ 
          mb: 3, 
          fontWeight: 600, 
          textAlign: 'center'
        }}>
          Features
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {/* Feature 1 - Big Board */}
          <Grow in={animate} timeout={900}>
            <Box sx={{ flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' }, minWidth: { sm: '280px' } }}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    Big Board
                  </Typography>
                  <Typography variant="body2">
                    View the latest NBA Draft prospects and their stats. Filter by position and team, 
                    get insights, and find prospects that match the Mavericks' needs.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/big-board"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1 
                    }}
                  >
                    View Big Board
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grow>

          {/* Feature 2 - Data Viz */}
          <Grow in={animate} timeout={1000}>
            <Box sx={{ flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' }, minWidth: { sm: '280px' } }}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    Data Visualization
                  </Typography>
                  <Typography variant="body2">
                    See how prospects stack up against each other with interactive 
                    charts and visualizations based on your specifications.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: '16px', pt: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/data-viz"
                    fullWidth
                    sx={{ borderRadius: '8px', py: 1 }}
                  >
                    Explore Data
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grow>
          
          {/* Feature 3 - Projections */}
          <Grow in={animate} timeout={1100}>
            <Box sx={{ flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' }, minWidth: { sm: '280px' } }}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    Player Projections AI
                  </Typography>
                  <Typography variant="body2">
                    Get AI-powered insights on prospect projections. Customize by 
                    timeline, position, and development focus areas.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/projection"
                    fullWidth
                    sx={{ borderRadius: '8px', py: 1 }}
                  >
                    View Projections
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grow>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 