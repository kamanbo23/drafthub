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
  TextField,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import ScatterPlotChart from '../components/ScatterPlotChart';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Enhanced data visualization with category switching
function DataViz() {
  // State for player data
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chart configuration
  const [activeTab, setActiveTab] = useState(0);
  const [category, setCategory] = useState('offense');
  const [xMetric, setXMetric] = useState('points');
  const [yMetric, setYMetric] = useState('assists');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState('scatter');
  
  const navigate = useNavigate();

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/comprehensive-data');
        const data = await response.json();
        const normalized = (data.allPlayers || []).map(p => {
          const clone = { ...p };
          ['fieldGoalPct', 'threePointPct', 'freeThrowPct'].forEach(key => {
            if (clone[key] != null && clone[key] > 1) {
              clone[key] = clone[key] / 100;
            }
          });
          return clone;
        });
        setAllPlayers(normalized);
        setFilteredPlayers(normalized);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter players based on search and view mode
  useEffect(() => {
    let filtered = allPlayers;

    // Only show college players
    filtered = filtered.filter(player => player.leagueType === 'NCAA');

    // Search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchLower) ||
        (player.currentTeam && player.currentTeam.toLowerCase().includes(searchLower))
      );
    }

    setFilteredPlayers(filtered);
  }, [allPlayers, searchQuery]);

  // Category-based metrics
  const getMetricsByCategory = (category) => {
    const metrics = {
      offense: [
        { key: 'points', label: 'Points Per Game' },
        { key: 'assists', label: 'Assists Per Game' },
        { key: 'fieldGoalPct', label: 'Field Goal %' },
        { key: 'threePointPct', label: 'Three Point %' },
        { key: 'freeThrowPct', label: 'Free Throw %' },
        { key: 'minutes', label: 'Minutes Per Game' }
      ],
      defense: [
        { key: 'steals', label: 'Steals Per Game' },
        { key: 'blocks', label: 'Blocks Per Game' },
        { key: 'rebounds', label: 'Rebounds Per Game' },
        { key: 'height', label: 'Height (inches)' },
        { key: 'weight', label: 'Weight (lbs)' }
      ],
      efficiency: [
        { key: 'fieldGoalPct', label: 'Field Goal %' },
        { key: 'freeThrowPct', label: 'Free Throw %' },
        { key: 'assists', label: 'Assists Per Game' },
        { key: 'points', label: 'Points Per Game' },
        { key: 'minutes', label: 'Minutes Per Game' }
      ],
      physical: [
        { key: 'height', label: 'Height (inches)' },
        { key: 'weight', label: 'Weight (lbs)' },
        { key: 'rebounds', label: 'Rebounds Per Game' },
        { key: 'blocks', label: 'Blocks Per Game' }
      ]
    };
    return metrics[category] || metrics.offense;
  };

  // Get available metrics for current category
  const availableMetrics = getMetricsByCategory(category);

  // Handler functions
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    
    // Auto-select appropriate default metrics for the category
    const categoryMetrics = getMetricsByCategory(newCategory);
    if (categoryMetrics.length >= 2) {
      setXMetric(categoryMetrics[0].key);
      setYMetric(categoryMetrics[1].key);
    }
  };

  const handleXMetricChange = (e) => {
    setXMetric(e.target.value);
  };

  const handleYMetricChange = (e) => {
    setYMetric(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Helper to get the display label for a metric
  const getMetricLabel = (key) => {
    const metric = availableMetrics.find(m => m.key === key);
    return metric ? metric.label : key;
  };

  // Generate bar chart data for category comparison
  const getBarChartData = () => {
    const topPlayers = filteredPlayers
      .filter(player => player[xMetric] != null)
      .sort((a, b) => (b[xMetric] || 0) - (a[xMetric] || 0))
      .slice(0, 10);

    return topPlayers.map(player => ({
      name: player.name.split(' ').pop(), // Last name only
      value: player[xMetric] || 0,
      fullName: player.name,
      team: player.currentTeam
    }));
  };

  // Generate position distribution data
  const getPositionData = () => {
    const positions = {};
    filteredPlayers.forEach(player => {
      const pos = player.position || 'Unknown';
      positions[pos] = (positions[pos] || 0) + 1;
    });

    return Object.entries(positions).map(([position, count]) => ({
      position,
      count,
      percentage: ((count / filteredPlayers.length) * 100).toFixed(1)
    }));
  };

  const colors = ['#e84a27', '#13294b', '#f39c12', '#27ae60', '#8e44ad'];

  // Tab panel component
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            mb: 0,
            fontWeight: 'bold',
            color: '#e84a27',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        >
          Illinois Basketball Player Measurements
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        align="center" 
        sx={{ 
          mb: 4, 
          color: 'text.secondary',
        }}
      >
        Physical measurements and athletic metrics for Illinois basketball players and recruits
      </Typography>
      
      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
            {/* Category Selection */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="offense">Offense</MenuItem>
                  <MenuItem value="defense">Defense</MenuItem>
                  <MenuItem value="efficiency">Efficiency</MenuItem>
                  <MenuItem value="physical">Physical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* X-Axis Metric */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>X-Axis Metric</InputLabel>
                <Select
                  value={xMetric}
                  label="X-Axis Metric"
                  onChange={handleXMetricChange}
                >
                  {availableMetrics.map(metric => (
                    <MenuItem key={`x-${metric.key}`} value={metric.key}>
                      {metric.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Y-Axis Metric */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Y-Axis Metric</InputLabel>
                <Select
                  value={yMetric}
                  label="Y-Axis Metric"
                  onChange={handleYMetricChange}
                >
                  {availableMetrics.map(metric => (
                    <MenuItem key={`y-${metric.key}`} value={metric.key}>
                      {metric.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Search */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Players"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name or team"
              />
            </Grid>
        </Grid>
      </Paper>

      {/* Visualization Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Scatter Plot" />
          <Tab label="Top Performers" />
          <Tab label="Position Analysis" />
          <Tab label="Team Comparison" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {getMetricLabel(xMetric)} vs {getMetricLabel(yMetric)}
            </Typography>
            <Box sx={{ height: 500 }}>
              <ScatterPlotChart
                data={filteredPlayers}
                xKey={xMetric}
                yKey={yMetric}
                xLabel={getMetricLabel(xMetric)}
                yLabel={getMetricLabel(yMetric)}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Showing {filteredPlayers.length} players • Click and drag to zoom • Hover for details
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Top 10 Players - {getMetricLabel(xMetric)}
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value.toFixed(1),
                      getMetricLabel(xMetric),
                      props.payload.fullName,
                      props.payload.team
                    ]}
                  />
                  <Bar dataKey="value" fill="#e84a27" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Position Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPositionData()}
                        dataKey="count"
                        nameKey="position"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ position, percentage }) => `${position} (${percentage}%)`}
                      >
                        {getPositionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Position Breakdown
                </Typography>
                <Box>
                  {getPositionData().map((pos, index) => (
                    <Card key={pos.position} sx={{ mb: 2 }}>
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: colors[index % colors.length],
                                borderRadius: '50%',
                                mr: 2
                              }}
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {pos.position}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                              {pos.count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {pos.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Team Comparison - Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced team comparison features will be available in the next update.
              This will include head-to-head team statistics, conference rankings, and performance trends.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/team-analytics')}
            >
              View Team Analytics
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default DataViz; 