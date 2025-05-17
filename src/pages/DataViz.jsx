import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

// todo:add actual charts, maybe use recharts or d3.js
function DataViz() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        color="primary"
        sx={{
          mb: 4,
          fontWeight: 'bold', // Make text bold
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Add subtle shadow
        }}
      >
        Data Visualization
      </Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1">
          Coming soon: Interactive charts and analytics for draft prospects
        </Typography>
      </Paper>
    </Container>
  );
}

export default DataViz; 