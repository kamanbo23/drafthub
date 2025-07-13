import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const PlayerComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonCategory, setComparisonCategory] = useState('overall');
  const [chartType, setChartType] = useState('radar');

  // Initialize with players from location state
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
        
        // Set initial players from location state
        if (location.state?.players) {
          setSelectedPlayers(location.state.players);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  // Comparison categories and their metrics
  const comparisonCategories = {
    overall: {
      name: 'Overall Performance',
      metrics: [
        { key: 'points', label: 'Points', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'rebounds', label: 'Rebounds', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'assists', label: 'Assists', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'steals', label: 'Steals', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'blocks', label: 'Blocks', format: (val) => val?.toFixed(1) || 'N/A' }
      ]
    },
    shooting: {
      name: 'Shooting Performance',
      metrics: [
        { key: 'fieldGoalPct', label: 'FG%', format: (val) => val ? (val * 100).toFixed(1) + '%' : 'N/A' },
        { key: 'threePointPct', label: '3P%', format: (val) => val ? (val * 100).toFixed(1) + '%' : 'N/A' },
        { key: 'freeThrowPct', label: 'FT%', format: (val) => val ? (val * 100).toFixed(1) + '%' : 'N/A' },
        { key: 'points', label: 'PPG', format: (val) => val?.toFixed(1) || 'N/A' }
      ]
    },
    physical: {
      name: 'Physical Attributes',
      metrics: [
        { key: 'height', label: 'Height', format: (val) => val ? `${Math.floor(val/12)}'${val%12}"` : 'N/A' },
        { key: 'weight', label: 'Weight', format: (val) => val ? `${val} lbs` : 'N/A' },
        { key: 'rebounds', label: 'Rebounds', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'blocks', label: 'Blocks', format: (val) => val?.toFixed(1) || 'N/A' }
      ]
    },
    advanced: {
      name: 'Advanced Stats',
      metrics: [
        { key: 'minutes', label: 'Minutes', format: (val) => val?.toFixed(1) || 'N/A' },
        { key: 'games', label: 'Games', format: (val) => val || 'N/A' },
        { key: 'fieldGoalPct', label: 'Efficiency', format: (val) => val ? (val * 100).toFixed(1) + '%' : 'N/A' }
      ]
    }
  };

  // Add player to comparison
  const addPlayer = (player) => {
    if (selectedPlayers.length < 4 && !selectedPlayers.find(p => p.playerId === player.playerId)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Remove player from comparison
  const removePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.playerId !== playerId));
  };

  // Generate radar chart data
  const getRadarData = () => {
    const metrics = comparisonCategories[comparisonCategory].metrics;
    const maxValues = {};
    
    // Calculate max values for normalization
    metrics.forEach(metric => {
      maxValues[metric.key] = Math.max(...selectedPlayers.map(p => p[metric.key] || 0));
    });

    return metrics.map(metric => {
      const dataPoint = {
        metric: metric.label,
        fullMark: maxValues[metric.key] || 1
      };
      
      selectedPlayers.forEach((player, index) => {
        dataPoint[`player${index}`] = player[metric.key] || 0;
      });
      
      return dataPoint;
    });
  };

  // Generate bar chart data
  const getBarData = () => {
    const metrics = comparisonCategories[comparisonCategory].metrics;
    return metrics.map(metric => {
      const dataPoint = {
        metric: metric.label
      };
      
      selectedPlayers.forEach((player, index) => {
        dataPoint[`player${index}`] = player[metric.key] || 0;
      });
      
      return dataPoint;
    });
  };

  // Player colors for charts
  const playerColors = ['#e84a27', '#13294b', '#f39c12', '#27ae60'];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Player Data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#e84a27',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        Player Comparison Tool
      </Typography>

      {/* Player Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Players to Compare (Max 4)
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {selectedPlayers.map((player, index) => (
            <Grid item key={player.playerId}>
              <Chip
                label={player.name}
                onDelete={() => removePlayer(player.playerId)}
                color="primary"
                variant="filled"
                sx={{ backgroundColor: playerColors[index] }}
              />
            </Grid>
          ))}
        </Grid>

        <FormControl sx={{ minWidth: 300, mb: 2 }}>
          <InputLabel>Add Player</InputLabel>
          <Select
            value=""
            label="Add Player"
            onChange={(e) => {
              const player = allPlayers.find(p => p.playerId === e.target.value);
              if (player) addPlayer(player);
            }}
            disabled={selectedPlayers.length >= 4}
          >
            {allPlayers
              .filter(p => !selectedPlayers.find(sp => sp.playerId === p.playerId))
              .map(player => (
                <MenuItem key={player.playerId} value={player.playerId}>
                  {player.name} - {player.currentTeam} ({player.position})
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {selectedPlayers.length < 2 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Select at least 2 players to begin comparison
          </Alert>
        )}
      </Paper>

      {selectedPlayers.length >= 2 && (
        <>
          {/* Comparison Controls */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Comparison Category</InputLabel>
                  <Select
                    value={comparisonCategory}
                    label="Comparison Category"
                    onChange={(e) => setComparisonCategory(e.target.value)}
                  >
                    {Object.entries(comparisonCategories).map(([key, category]) => (
                      <MenuItem key={key} value={key}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={chartType}
                    label="Chart Type"
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <MenuItem value="radar">Radar Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="table">Table View</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Visualization */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {comparisonCategories[comparisonCategory].name} Comparison
            </Typography>

            {chartType === 'radar' && (
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                    {selectedPlayers.map((player, index) => (
                      <Radar
                        key={player.playerId}
                        name={player.name}
                        dataKey={`player${index}`}
                        stroke={playerColors[index]}
                        fill={playerColors[index]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'bar' && (
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBarData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedPlayers.map((player, index) => (
                      <Bar
                        key={player.playerId}
                        dataKey={`player${index}`}
                        fill={playerColors[index]}
                        name={player.name}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'table' && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Metric</strong></TableCell>
                      {selectedPlayers.map((player, index) => (
                        <TableCell key={player.playerId} align="center">
                          <strong style={{ color: playerColors[index] }}>
                            {player.name}
                          </strong>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comparisonCategories[comparisonCategory].metrics.map((metric) => (
                      <TableRow key={metric.key}>
                        <TableCell>{metric.label}</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.playerId} align="center">
                            {metric.format(player[metric.key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Player Details Cards */}
          <Grid container spacing={3}>
            {selectedPlayers.map((player, index) => (
              <Grid item xs={12} md={6} lg={3} key={player.playerId}>
                <Card sx={{ 
                  border: `2px solid ${playerColors[index]}`,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: playerColors[index] }}>
                      {player.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {player.currentTeam} • {player.position} • {player.year || 'N/A'}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Height/Weight:</strong> {player.height ? `${Math.floor(player.height/12)}'${player.height%12}"` : 'N/A'} / {player.weight ? `${player.weight} lbs` : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Hometown:</strong> {player.homeTown || 'N/A'}, {player.homeState || 'N/A'}
                      </Typography>
                      {player.highSchool && (
                        <Typography variant="body2">
                          <strong>High School:</strong> {player.highSchool}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/player/${player.playerId}`, { state: { player } })}
                    >
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default PlayerComparison; 