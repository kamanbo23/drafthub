import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import ScatterPlotChart from '../components/ScatterPlotChart';
import playerData from '../intern_project_data.json';

// Basic data visualization with a scatter plot
function DataViz() {
  // Sample data for initial testing
  const sampleData = playerData.measurements.slice(0, 15).map(measurement => {
    const player = playerData.bio.find(p => p.playerId === measurement.playerId);
    return {
      name: player ? player.name : 'Unknown',
      playerId: measurement.playerId,
      wingspan: measurement.wingspan,
      heightNoShoes: measurement.heightNoShoes,
      maxVertical: measurement.maxVertical,
      weight: measurement.weight
    };
  });

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
      
      {/* Basic scatter plot */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Wingspan vs Height
        </Typography>
        <Box sx={{ height: 450 }}>
          <ScatterPlotChart
            data={sampleData}
            xKey="heightNoShoes"
            yKey="wingspan"
            xLabel="Height (no shoes)"
            yLabel="Wingspan"
          />
        </Box>
      </Paper>
    </Container>
  );
}

export default DataViz; 