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
  Grow,
  Grid,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import logo from '/logo.png';

// Illinois Basketball Analytics Platform Home Page
function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
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
        background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
      }}
    >
      {/* Hero Section */}
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
              alt="Illinois Basketball Logo" 
              style={{ 
                maxWidth: '200px',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Box>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(45deg, #e84a27, #13294b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Illinois Basketball Analytics Platform
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}>
            Comprehensive scouting, player evaluation, and team analytics for the Illinois Men's Basketball program
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Player Scouting" color="primary" variant="outlined" />
            <Chip label="Advanced Analytics" color="primary" variant="outlined" />
            <Chip label="Lineup Building" color="primary" variant="outlined" />
            <Chip label="Recruiting Intelligence" color="primary" variant="outlined" />
          </Box>
        </Paper>
      </Grow>
      
      {/* Main Features */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ 
          mb: 4, 
          fontWeight: 600, 
          textAlign: 'center',
          color: '#e84a27'
        }}>
          Analytics Tools
        </Typography>
        
        <Grid container spacing={3}>


          {/* Scouting Board */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={1200}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SearchIcon sx={{ fontSize: 40, color: '#13294b', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Scouting Board
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Advanced scouting interface with category switching for offense, defense, and efficiency. 
                    Detailed player analysis with radar charts and performance metrics.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/scouting"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#13294b',
                      '&:hover': { backgroundColor: '#0f1f35' }
                    }}
                  >
                    Start Scouting
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>

          {/* Player Comparison */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={1400}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CompareArrowsIcon sx={{ fontSize: 40, color: '#f39c12', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Player Comparison
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Side-by-side player analysis with advanced visualizations. Compare up to 4 players 
                    across multiple statistical categories with interactive charts.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/comparison"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#f39c12',
                      '&:hover': { backgroundColor: '#e67e22' }
                    }}
                  >
                    Compare Players
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>

          {/* Lineup Builder */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={1600}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupsIcon sx={{ fontSize: 40, color: '#27ae60', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Lineup Builder
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Build and analyze different lineup combinations. Evaluate team chemistry, 
                    position balance, and performance projections for optimal roster construction.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/lineup-builder"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#27ae60',
                      '&:hover': { backgroundColor: '#229954' }
                    }}
                  >
                    Build Lineups
                  </Button>
                </CardActions>
              </Card>
          </Grow>
          </Grid>

          {/* Team Analytics */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={1800}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#8e44ad', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Team Analytics
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Comprehensive team performance analysis with KenPom integration. Track efficiency metrics, 
                    conference comparisons, and performance trends throughout the season.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/team-analytics"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#8e44ad',
                      '&:hover': { backgroundColor: '#7d3c98' }
                    }}
                  >
                    View Analytics
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>

          {/* Data Visualization */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={2000}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AnalyticsIcon sx={{ fontSize: 40, color: '#e67e22', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Player Measurements
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Physical measurements and athletic metrics analysis. Explore player dimensions, 
                    performance data through interactive charts and position-based comparisons.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/data-viz"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#e67e22',
                      '&:hover': { backgroundColor: '#d35400' }
                    }}
                  >
                    View Measurements
                  </Button>
                </CardActions>
              </Card>
          </Grow>
          </Grid>
          
          {/* Player Projections */}
          <Grid item xs={12} md={6} lg={4}>
            <Grow in={animate} timeout={2200}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PsychologyIcon sx={{ fontSize: 40, color: '#9b59b6', mr: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Player Projections
                  </Typography>
                  </Box>
                  <Typography variant="body2">
                    AI-powered scouting reports and player development projections. Generate detailed 
                    analysis with customizable timelines and focus areas using advanced language models.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/projection"
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      backgroundColor: '#9b59b6',
                      '&:hover': { backgroundColor: '#8e44ad' }
                    }}
                  >
                    Generate Projections
                  </Button>
                </CardActions>
              </Card>
          </Grow>
          </Grid>
        </Grid>
        </Box>

      {/* Data Sources */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ 
          mb: 3, 
          fontWeight: 600, 
          textAlign: 'center',
          color: '#13294b'
        }}>
          Data Sources & Integration
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ color: '#e84a27', fontWeight: 'bold' }}>
                BartTorvik
              </Typography>
              <Typography variant="body2">
                Illinois roster data and college basketball statistics
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ color: '#e84a27', fontWeight: 'bold' }}>
                KenPom
              </Typography>
              <Typography variant="body2">
                Advanced team efficiency metrics and rankings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ color: '#e84a27', fontWeight: 'bold' }}>
                247Sports
              </Typography>
              <Typography variant="body2">
                Recruiting rankings and prospect evaluations
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" sx={{ color: '#e84a27', fontWeight: 'bold' }}>
                MaxPreps
              </Typography>
              <Typography variant="body2">
                High school statistical leaders and performance data
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Platform Features */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#13294b', fontWeight: 'bold' }}>
          Platform Capabilities
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Real-time data integration from multiple sources
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Advanced statistical analysis and visualization
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Player comparison and evaluation tools
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Lineup optimization and team chemistry analysis
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Recruiting intelligence and prospect tracking
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ AI-powered player projections and scouting reports
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Interactive charts and responsive design
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Team performance trends and efficiency metrics
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home; 