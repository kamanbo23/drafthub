import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
// Drag and drop functionality can be added later if needed
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import GroupsIcon from '@mui/icons-material/Groups';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const LineupBuilder = () => {
  // State management
  const [players, setPlayers] = useState([]);
  const [currentLineup, setCurrentLineup] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null
  });
  const [bench, setBench] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lineupAnalysis, setLineupAnalysis] = useState(null);
  const [savedLineups, setSavedLineups] = useState([]);
  const [activeScenario, setActiveScenario] = useState('default');

  // Fetch Illinois roster data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/illinois-roster');
        const data = await response.json();
        setPlayers(data);
        setBench(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Analyze lineup when it changes
  useEffect(() => {
    if (Object.values(currentLineup).filter(Boolean).length === 5) {
      analyzeLineup();
    }
  }, [currentLineup]);

  // Lineup scenarios
  const scenarios = {
    default: 'Balanced Lineup',
    offense: 'Offensive Focus',
    defense: 'Defensive Focus',
    smallBall: 'Small Ball',
    bigLineup: 'Big Lineup'
  };

  // Analyze current lineup
  const analyzeLineup = () => {
    const lineupPlayers = Object.values(currentLineup).filter(Boolean);
    
    if (lineupPlayers.length !== 5) {
      setLineupAnalysis(null);
      return;
    }

    // Calculate team stats
    const teamStats = {
      avgPoints: lineupPlayers.reduce((sum, p) => sum + (p.points || 0), 0) / 5,
      avgRebounds: lineupPlayers.reduce((sum, p) => sum + (p.rebounds || 0), 0) / 5,
      avgAssists: lineupPlayers.reduce((sum, p) => sum + (p.assists || 0), 0) / 5,
      avgHeight: lineupPlayers.reduce((sum, p) => sum + (p.height || 0), 0) / 5,
      avgWeight: lineupPlayers.reduce((sum, p) => sum + (p.weight || 0), 0) / 5,
      totalExperience: lineupPlayers.reduce((sum, p) => {
        const yearValue = { 'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4 };
        return sum + (yearValue[p.year] || 0);
      }, 0)
    };

    // Calculate strengths and weaknesses
    const strengths = [];
    const weaknesses = [];

    if (teamStats.avgPoints > 15) strengths.push('High Scoring');
    if (teamStats.avgRebounds > 6) strengths.push('Strong Rebounding');
    if (teamStats.avgAssists > 3) strengths.push('Good Ball Movement');
    if (teamStats.avgHeight > 78) strengths.push('Size Advantage');
    if (teamStats.totalExperience > 12) strengths.push('Experienced');

    if (teamStats.avgPoints < 10) weaknesses.push('Limited Scoring');
    if (teamStats.avgRebounds < 4) weaknesses.push('Rebounding Concerns');
    if (teamStats.avgAssists < 2) weaknesses.push('Ball Movement Issues');
    if (teamStats.avgHeight < 76) weaknesses.push('Size Disadvantage');
    if (teamStats.totalExperience < 8) weaknesses.push('Inexperienced');

    // Position balance
    const positionBalance = calculatePositionBalance(lineupPlayers);
    
    // Chemistry score (simplified)
    const chemistryScore = calculateChemistryScore(lineupPlayers);

    setLineupAnalysis({
      teamStats,
      strengths,
      weaknesses,
      positionBalance,
      chemistryScore,
      overallRating: calculateOverallRating(teamStats, chemistryScore)
    });
  };

  // Calculate position balance
  const calculatePositionBalance = (lineupPlayers) => {
    const positions = lineupPlayers.map(p => p.position);
    const balance = {
      guards: positions.filter(p => ['PG', 'SG'].includes(p)).length,
      forwards: positions.filter(p => ['SF', 'PF'].includes(p)).length,
      centers: positions.filter(p => p === 'C').length
    };
    
    return balance;
  };

  // Calculate chemistry score
  const calculateChemistryScore = (lineupPlayers) => {
    let score = 50; // Base score
    
    // Experience factor
    const avgExperience = lineupPlayers.reduce((sum, p) => {
      const yearValue = { 'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4 };
      return sum + (yearValue[p.year] || 0);
    }, 0) / 5;
    
    score += avgExperience * 5;
    
    // Position fit
    const properPositions = Object.entries(currentLineup).filter(([pos, player]) => 
      player && player.position === pos
    ).length;
    
    score += properPositions * 8;
    
    // Height distribution
    const heights = lineupPlayers.map(p => p.height || 0).sort((a, b) => a - b);
    const heightSpread = heights[4] - heights[0];
    if (heightSpread > 6 && heightSpread < 12) score += 10;
    
    return Math.min(100, Math.max(0, score));
  };

  // Calculate overall rating
  const calculateOverallRating = (teamStats, chemistryScore) => {
    const statScore = (teamStats.avgPoints * 2 + teamStats.avgRebounds * 3 + teamStats.avgAssists * 4) / 9;
    return Math.round((statScore * 0.7 + chemistryScore * 0.3) * 10) / 10;
  };

  // Handle player assignment to position
  const assignPlayerToPosition = (player, position) => {
    // Remove player from current position if assigned
    const newLineup = { ...currentLineup };
    Object.keys(newLineup).forEach(pos => {
      if (newLineup[pos]?.playerId === player.playerId) {
        newLineup[pos] = null;
      }
    });
    
    // Add player to bench if position is occupied
    if (newLineup[position]) {
      setBench([...bench, newLineup[position]]);
    }
    
    // Assign player to new position
    newLineup[position] = player;
    setCurrentLineup(newLineup);
    
    // Remove player from bench
    setBench(bench.filter(p => p.playerId !== player.playerId));
  };

  // Remove player from lineup
  const removePlayerFromLineup = (position) => {
    const player = currentLineup[position];
    if (player) {
      setCurrentLineup({ ...currentLineup, [position]: null });
      setBench([...bench, player]);
    }
  };

  // Save current lineup
  const saveLineup = () => {
    const lineupName = `Lineup ${savedLineups.length + 1}`;
    const newLineup = {
      name: lineupName,
      lineup: { ...currentLineup },
      analysis: lineupAnalysis,
      timestamp: new Date().toISOString()
    };
    setSavedLineups([...savedLineups, newLineup]);
  };

  // Load saved lineup
  const loadLineup = (savedLineup) => {
    setCurrentLineup(savedLineup.lineup);
    // Update bench to exclude loaded players
    const loadedPlayerIds = Object.values(savedLineup.lineup).filter(Boolean).map(p => p.playerId);
    setBench(players.filter(p => !loadedPlayerIds.includes(p.playerId)));
  };

  // Get position color
  const getPositionColor = (position) => {
    const colors = {
      PG: '#e84a27',
      SG: '#13294b',
      SF: '#f39c12',
      PF: '#27ae60',
      C: '#8e44ad'
    };
    return colors[position] || '#grey';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Illinois Roster...
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
        Illinois Basketball Lineup Builder
      </Typography>

      <Grid container spacing={3}>
        {/* Lineup Formation */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Starting Lineup
            </Typography>
            
            {/* Basketball Court Visual */}
            <Box sx={{ 
              position: 'relative', 
              height: 300, 
              backgroundImage: 'linear-gradient(90deg, #e8f5e8 0%, #f0f8f0 100%)',
              borderRadius: 2,
              border: '2px solid #ccc',
              mb: 3
            }}>
              {/* Position slots */}
              {Object.entries(currentLineup).map(([position, player], index) => (
                <Box
                  key={position}
                  sx={{
                    position: 'absolute',
                    top: `${20 + (index * 50)}px`,
                    left: `${50 + (index % 2) * 200}px`,
                    width: 120,
                    height: 60,
                    border: `2px dashed ${getPositionColor(position)}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: player ? getPositionColor(position) : 'transparent',
                    color: player ? 'white' : getPositionColor(position),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => player && removePlayerFromLineup(position)}
                >
                  {player ? (
                    <Box textAlign="center">
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {position}
                      </Typography>
                      <Typography variant="body2">
                        {player.name.split(' ').pop()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {position}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                onClick={saveLineup}
                disabled={Object.values(currentLineup).filter(Boolean).length !== 5}
                startIcon={<GroupsIcon />}
              >
                Save Lineup
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCurrentLineup({ PG: null, SG: null, SF: null, PF: null, C: null })}
                startIcon={<SwapHorizIcon />}
              >
                Clear Lineup
              </Button>
            </Box>
          </Paper>

          {/* Available Players */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Players
            </Typography>
            
            <Grid container spacing={2}>
              {bench.map(player => (
                <Grid item xs={12} sm={6} md={4} key={player.playerId}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      border: `1px solid ${getPositionColor(player.position)}`
                    }}
                    onClick={() => {
                      // Auto-assign to preferred position or let user choose
                      if (!currentLineup[player.position]) {
                        assignPlayerToPosition(player, player.position);
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: getPositionColor(player.position),
                          width: 32,
                          height: 32,
                          mr: 1
                        }}>
                          {player.position}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {player.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {player.year} • {player.height ? `${Math.floor(player.height/12)}'${player.height%12}"` : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span>PPG: {player.points?.toFixed(1) || 'N/A'}</span>
                        <span>RPG: {player.rebounds?.toFixed(1) || 'N/A'}</span>
                        <span>APG: {player.assists?.toFixed(1) || 'N/A'}</span>
                      </Box>

                      {/* Position assignment buttons */}
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                        {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                          <Button
                            key={pos}
                            size="small"
                            variant={currentLineup[pos] ? 'outlined' : 'contained'}
                            disabled={currentLineup[pos] && currentLineup[pos].playerId !== player.playerId}
                            onClick={(e) => {
                              e.stopPropagation();
                              assignPlayerToPosition(player, pos);
                            }}
                            sx={{ 
                              minWidth: 'auto',
                              px: 1,
                              py: 0.5,
                              fontSize: '0.7rem'
                            }}
                          >
                            {pos}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Analysis Panel */}
        <Grid item xs={12} lg={4}>
          {/* Lineup Analysis */}
          {lineupAnalysis && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lineup Analysis
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="primary" align="center">
                  {lineupAnalysis.overallRating}/100
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Overall Rating
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Team Stats */}
              <Typography variant="subtitle2" gutterBottom>
                Team Averages
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Points: {lineupAnalysis.teamStats.avgPoints.toFixed(1)} PPG
                </Typography>
                <Typography variant="body2">
                  Rebounds: {lineupAnalysis.teamStats.avgRebounds.toFixed(1)} RPG
                </Typography>
                <Typography variant="body2">
                  Assists: {lineupAnalysis.teamStats.avgAssists.toFixed(1)} APG
                </Typography>
                <Typography variant="body2">
                  Height: {Math.floor(lineupAnalysis.teamStats.avgHeight/12)}'{lineupAnalysis.teamStats.avgHeight%12}"
                </Typography>
                <Typography variant="body2">
                  Chemistry: {lineupAnalysis.chemistryScore}/100
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Strengths */}
              <Typography variant="subtitle2" gutterBottom>
                Strengths
              </Typography>
              <Box sx={{ mb: 2 }}>
                {lineupAnalysis.strengths.map((strength, index) => (
                  <Chip 
                    key={index}
                    label={strength}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Weaknesses */}
              <Typography variant="subtitle2" gutterBottom>
                Areas for Improvement
              </Typography>
              <Box sx={{ mb: 2 }}>
                {lineupAnalysis.weaknesses.map((weakness, index) => (
                  <Chip 
                    key={index}
                    label={weakness}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          {/* Saved Lineups */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Saved Lineups
            </Typography>
            
            {savedLineups.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No saved lineups yet. Create and save your first lineup!
              </Typography>
            ) : (
              <List>
                {savedLineups.map((savedLineup, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => loadLineup(savedLineup)}
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemText
                      primary={savedLineup.name}
                      secondary={`Rating: ${savedLineup.analysis?.overallRating || 'N/A'}/100`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LineupBuilder; 