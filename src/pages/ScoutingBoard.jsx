import React, { useState, useEffect, useMemo } from 'react';
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
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ScoutingBoard = () => {
  const navigate = useNavigate();
  
  // State management
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('college'); // 'college' or 'highschool'
  const [category, setCategory] = useState('offense');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/comprehensive-data');
        const data = await response.json();
        // Normalize percentage-based stats (FG%, 3P%, FT%) to 0-1 range for consistency
        const normalized = (data.allPlayers || []).map(p => {
          const clone = { ...p };
          ['fieldGoalPct', 'threePointPct', 'freeThrowPct'].forEach(key => {
            if (clone[key] != null && clone[key] > 1) {
              clone[key] = clone[key] / 100;
            }
          });
          return clone;
        });
        setPlayers(normalized);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load player data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let filtered = players.filter(player => {
      // View mode filter
      if (viewMode === 'college' && player.leagueType !== 'NCAA') return false;
      if (viewMode === 'highschool' && player.leagueType !== 'HS') return false;
      
      // Search filter
      if (searchTerm && !player.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Position filter
      if (positionFilter !== 'all' && player.position !== positionFilter) return false;
      
      return true;
    });

    // Sort players
    filtered.sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    return filtered;
  }, [players, viewMode, searchTerm, positionFilter, sortBy, sortOrder]);

  // Get category metrics
  const getCategoryMetrics = (category) => {
    const metrics = {
      offense: ['points', 'assists', 'fieldGoalPct', 'threePointPct'],
      defense: ['steals', 'blocks', 'rebounds'],
      efficiency: ['fieldGoalPct', 'freeThrowPct', 'assists'],
      athleticism: ['rebounds', 'steals', 'blocks'],
      shooting: ['fieldGoalPct', 'threePointPct', 'freeThrowPct']
    };
    return metrics[category] || metrics.offense;
  };

  // Handle player selection for comparison
  const handlePlayerSelect = (player) => {
    setSelectedPlayers(prev => {
      if (prev.find(p => p.playerId === player.playerId)) {
        return prev.filter(p => p.playerId !== player.playerId);
      } else if (prev.length < 3) {
        return [...prev, player];
      }
      return prev;
    });
  };

  // Generate radar chart data
  const getRadarData = (player) => {
    const metrics = getCategoryMetrics(category);
    return metrics.map(metric => ({
      metric: metric.charAt(0).toUpperCase() + metric.slice(1),
      value: player[metric] || 0,
      fullMark: metric.includes('Pct') ? 1 : 30
    }));
  };

  // Render player card
  const renderPlayerCard = (player) => (
    <Card 
      key={player.playerId} 
      sx={{ 
        mb: 2, 
        border: selectedPlayers.find(p => p.playerId === player.playerId) ? '2px solid #e84a27' : 'none',
        cursor: 'pointer',
        '&:hover': { 
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={() => handlePlayerSelect(player)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            {player.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={player.position} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            {player.isRecruit && (
              <Chip 
                label="Recruit" 
                size="small" 
                color="secondary" 
                variant="filled"
              />
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {player.currentTeam} • {player.year || 'N/A'}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>PPG:</strong> {player.points?.toFixed(1) || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>RPG:</strong> {player.rebounds?.toFixed(1) || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>APG:</strong> {player.assists?.toFixed(1) || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>FG%:</strong> {player.fieldGoalPct ? (player.fieldGoalPct * 100).toFixed(1) + '%' : 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        {/* Radar Chart for selected category */}
        {selectedPlayers.find(p => p.playerId === player.playerId) && (
          <Box sx={{ mt: 2, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={getRadarData(player)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                <Radar
                  name={player.name}
                  dataKey="value"
                  stroke="#e84a27"
                  fill="#e84a27"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/player/${player.playerId}`, { state: { player } });
          }}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          startIcon={<CompareArrowsIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate('/comparison', { state: { players: [player] } });
          }}
        >
          Compare
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Scouting Data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
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
        Illinois Basketball Scouting Board
      </Typography>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* View Mode Toggle */}
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'highschool'}
                  onChange={(e) => setViewMode(e.target.checked ? 'highschool' : 'college')}
                  color="primary"
                />
              }
              label={viewMode === 'college' ? 'College Players' : 'High School Players'}
            />
          </Grid>

          {/* Category Selection */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="offense">Offense</MenuItem>
                <MenuItem value="defense">Defense</MenuItem>
                <MenuItem value="efficiency">Efficiency</MenuItem>
                <MenuItem value="athleticism">Athleticism</MenuItem>
                <MenuItem value="shooting">Shooting</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Position Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={positionFilter}
                label="Position"
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                <MenuItem value="all">All Positions</MenuItem>
                <MenuItem value="PG">Point Guard</MenuItem>
                <MenuItem value="SG">Shooting Guard</MenuItem>
                <MenuItem value="SF">Small Forward</MenuItem>
                <MenuItem value="PF">Power Forward</MenuItem>
                <MenuItem value="C">Center</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Players"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="points">Points</MenuItem>
                <MenuItem value="rebounds">Rebounds</MenuItem>
                <MenuItem value="assists">Assists</MenuItem>
                <MenuItem value="fieldGoalPct">FG%</MenuItem>
                <MenuItem value="threePointPct">3P%</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Selected Players for Comparison */}
        {selectedPlayers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Selected for Comparison ({selectedPlayers.length}/3)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedPlayers.map(player => (
                <Chip
                  key={player.playerId}
                  label={player.name}
                  onDelete={() => handlePlayerSelect(player)}
                  color="primary"
                  variant="filled"
                />
              ))}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/comparison', { state: { players: selectedPlayers } })}
              disabled={selectedPlayers.length < 2}
            >
              Compare Selected Players
            </Button>
          </Box>
        )}
      </Paper>

      {/* Results */}
      <Typography variant="h5" gutterBottom>
        {viewMode === 'college' ? 'College Players' : 'High School Players'} - {category.charAt(0).toUpperCase() + category.slice(1)} Focus
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing {filteredPlayers.length} players • Click players to select for comparison
      </Typography>

      <Grid container spacing={3}>
        {filteredPlayers.map(player => (
          <Grid item xs={12} md={6} lg={4} key={player.playerId}>
            {renderPlayerCard(player)}
          </Grid>
        ))}
      </Grid>

      {filteredPlayers.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No players found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ScoutingBoard; 