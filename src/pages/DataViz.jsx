import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField 
} from '@mui/material';
import ScatterPlotChart from '../components/ScatterPlotChart';
import playerData from '../intern_project_data.json';
import { preparePlayerData, getAvailableMetrics } from '../utils/dataUtils';

// basic data visualization with a scatter plot
function DataViz() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [xMetric, setXMetric] = useState('heightNoShoes');
  const [yMetric, setYMetric] = useState('wingspan');
  const [searchQuery, setSearchQuery] = useState('');
  
  const metrics = getAvailableMetrics();

  useEffect(() => {
    const combinedData = preparePlayerData(playerData.bio, playerData.measurements);
    setAllPlayers(combinedData);
    setFilteredPlayers(combinedData);
  }, []);

  // filter players when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlayers(allPlayers);
      return;
    }

    const filtered = allPlayers.filter(player => 
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [searchQuery, allPlayers]);

  //  metric selection changes
  const handleXMetricChange = (e) => {
    setXMetric(e.target.value);
  };

  const handleYMetricChange = (e) => {
    setYMetric(e.target.value);
  };

  //  search 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // label metric
  const getMetricLabel = (key) => {
    const metric = metrics.find(m => m.key === key);
    return metric ? metric.label : key;
  };

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
        Draft Prospect Visualization

      </Typography>

      <Typography 
        variant="body2" 
        align="center" 
        sx={{ 
          mb: 2, 
          mt: -2, 
          fontStyle: 'italic',
        }}
      >
        <p>Use this tool on Desktop preferably due to the nature of a scatter plot.</p>
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="x-axis-label">X-Axis Metric</InputLabel>
            <Select
              labelId="x-axis-label"
              value={xMetric}
              label="X-Axis Metric"
              onChange={handleXMetricChange}
            >
              {metrics.map(metric => (
                <MenuItem key={`x-${metric.key}`} value={metric.key}>
                  {metric.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="y-axis-label">Y-Axis Metric</InputLabel>
            <Select
              labelId="y-axis-label"
              value={yMetric}
              label="Y-Axis Metric"
              onChange={handleYMetricChange}
            >
              {metrics.map(metric => (
                <MenuItem key={`y-${metric.key}`} value={metric.key}>
                  {metric.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Search Player"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />
        </Box>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {getMetricLabel(xMetric)} vs {getMetricLabel(yMetric)}
        </Typography>
        <Box sx={{ height: 450 }}>
          <ScatterPlotChart
            data={filteredPlayers}
            xKey={xMetric}
            yKey={yMetric}
            xLabel={getMetricLabel(xMetric)}
            yLabel={getMetricLabel(yMetric)}
          />
        </Box>

      </Paper>
    </Container>
  );
}

export default DataViz; 