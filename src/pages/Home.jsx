import React from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '/logo.png';

// home page with MUI styling for consistency
function Home() {
  return (
    <Container maxWidth="lg" disableGutters={false} sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img 
            src={logo}
            alt="Mavericks Logo" 
            style={{ maxWidth: '200px' }}
          />
        </Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Welcome to the Mavericks Draft Hub
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          A companion for evaluating NBA Draft prospects
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{ mb: 3 }}>
          Features
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ 
            flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' },
            minWidth: { sm: '280px' }
          }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" color="primary" gutterBottom>
                  Big Board
                </Typography>
                <Typography variant="body2">
                  View the latest NBA Draft prospects and their stats. Filter by position and team, 
                  get insights, and find prospects that match the Mavericks' needs.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/big-board"
                  fullWidth
                >
                  View Big Board
                </Button>
              </CardActions>
            </Card>
          </Box>
          
          <Box sx={{ 
            flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' },
            minWidth: { sm: '280px' }
          }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" color="primary" gutterBottom>
                  Data Visualization
                </Typography>
                <Typography variant="body2">
                  See how prospects stack up against each other with interactive 
                  charts and visualizations based on your specifications.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/data-viz"
                  fullWidth
                >
                  Explore Data
                </Button>
              </CardActions>
            </Card>
          </Box>
          
          <Box sx={{ 
            flex: { xs: '1 0 100%', sm: '1 0 45%', md: '1 0 30%' },
            minWidth: { sm: '280px' }
          }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" color="primary" gutterBottom>
                  Player Projections AI
                </Typography>
                <Typography variant="body2">
                  Get AI-powered insights on prospect projections. Customize by 
                  timeline, position, and development focus areas.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/projection"
                  fullWidth
                >
                  View Projections
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 