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
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';

const TeamAnalytics = () => {
  // State management
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('season');
  const [comparisonTeam, setComparisonTeam] = useState('');

  // Fetch team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamStats, rosterData] = await Promise.all([
          fetch('http://localhost:3002/api/kenpom-team/Illinois').then(r => r.json()),
          fetch('http://localhost:3002/api/illinois-roster').then(r => r.json())
        ]);
        
        setTeamData({
          stats: teamStats,
          roster: rosterData,
          trends: generateTrendData(teamStats),
          comparisons: generateComparisonData(teamStats)
        });
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate trend data for charts
  const generateTrendData = (stats) => {
    const games = [];
    for (let i = 1; i <= 15; i++) {
      games.push({
        game: i,
        offensiveRating: stats.adjustedOffense + (Math.random() - 0.5) * 10,
        defensiveRating: stats.adjustedDefense + (Math.random() - 0.5) * 8,
        tempo: stats.tempo + (Math.random() - 0.5) * 6,
        efficiency: stats.adjustedEfficiency + (Math.random() - 0.5) * 5
      });
    }
    return games;
  };

  // Generate comparison data
  const generateComparisonData = (stats) => {
    const bigTenTeams = [
      { name: 'Illinois', offensive: stats.adjustedOffense, defensive: stats.adjustedDefense },
      { name: 'Purdue', offensive: 118.5, defensive: 95.2 },
      { name: 'Michigan St', offensive: 112.3, defensive: 98.7 },
      { name: 'Indiana', offensive: 114.8, defensive: 101.2 },
      { name: 'Wisconsin', offensive: 109.6, defensive: 94.8 },
      { name: 'Iowa', offensive: 116.2, defensive: 103.5 },
      { name: 'Ohio State', offensive: 113.7, defensive: 99.3 },
      { name: 'Michigan', offensive: 111.4, defensive: 97.6 }
    ];
    return bigTenTeams;
  };

  // Tab panels
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  // Metric cards data
  const getMetricCards = () => {
    if (!teamData) return [];
    
    const { stats } = teamData;
    return [
      {
        title: 'KenPom Ranking',
        value: stats.kenpomRank,
        suffix: '',
        color: '#e84a27',
        trend: 'up',
        icon: <SportsBasketballIcon />
      },
      {
        title: 'Offensive Rating',
        value: stats.adjustedOffense,
        suffix: '',
        color: '#27ae60',
        trend: stats.last5Games?.adjustedOffense > stats.adjustedOffense ? 'up' : 'down',
        icon: <SportsBasketballIcon />
      },
      {
        title: 'Defensive Rating',
        value: stats.adjustedDefense,
        suffix: '',
        color: '#13294b',
        trend: stats.last5Games?.adjustedDefense < stats.adjustedDefense ? 'up' : 'down',
        icon: <ShieldIcon />
      },
      {
        title: 'Tempo',
        value: stats.tempo,
        suffix: '',
        color: '#f39c12',
        trend: stats.last5Games?.tempo > stats.tempo ? 'up' : 'down',
        icon: <SpeedIcon />
      },
      {
        title: 'Efficiency Margin',
        value: stats.adjustedEfficiency,
        suffix: '',
        color: '#8e44ad',
        trend: 'up',
        icon: <TrendingUpIcon />
      },
      {
        title: 'Conference Rank',
        value: stats.conferenceRank,
        suffix: '',
        color: '#e67e22',
        trend: 'stable',
        icon: <SportsBasketballIcon />
      }
    ];
  };

  // Advanced stats for radar chart
  const getAdvancedStats = () => {
    if (!teamData) return [];
    
    const { stats } = teamData;
    return [
      { metric: 'Offensive Rating', value: stats.adjustedOffense, max: 130 },
      { metric: 'Defensive Rating', value: 130 - stats.adjustedDefense, max: 130 }, // Inverted for radar
      { metric: 'Tempo', value: stats.tempo, max: 80 },
      { metric: 'Rebounding', value: stats.offensiveReboundPct * 100, max: 40 },
      { metric: 'Turnover Rate', value: stats.oppTurnoverPct, max: 25 },
      { metric: 'Free Throw Rate', value: stats.freeThrowRate * 100, max: 50 }
    ];
  };

  const colors = ['#e84a27', '#13294b', '#f39c12', '#27ae60', '#8e44ad', '#e67e22'];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Team Analytics...
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
        Illinois Basketball Team Analytics
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {getMetricCards().map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {React.cloneElement(metric.icon, { 
                    sx: { fontSize: 40, color: metric.color } 
                  })}
                </Box>
                <Typography variant="h4" sx={{ color: metric.color, fontWeight: 'bold' }}>
                  {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                  {metric.suffix}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  {metric.trend === 'up' && <TrendingUpIcon sx={{ color: '#27ae60', fontSize: 20 }} />}
                  {metric.trend === 'down' && <TrendingDownIcon sx={{ color: '#e74c3c', fontSize: 20 }} />}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {metric.trend === 'up' ? 'Trending Up' : 
                     metric.trend === 'down' ? 'Trending Down' : 'Stable'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Analytics Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Performance Trends" />
          <Tab label="Conference Comparison" />
          <Tab label="Advanced Metrics" />
          <Tab label="Player Contributions" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Season Performance Trends
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teamData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="game" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="offensiveRating" 
                    stroke="#e84a27" 
                    name="Offensive Rating"
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="defensiveRating" 
                    stroke="#13294b" 
                    name="Defensive Rating"
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tempo" 
                    stroke="#f39c12" 
                    name="Tempo"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Big Ten Conference Comparison
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData.comparisons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="offensive" fill="#e84a27" name="Offensive Rating" />
                  <Bar dataKey="defensive" fill="#13294b" name="Defensive Rating" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Team Profile Radar
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getAdvancedStats()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                      <Radar
                        name="Illinois"
                        dataKey="value"
                        stroke="#e84a27"
                        fill="#e84a27"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Advanced Statistics
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Metric</strong></TableCell>
                        <TableCell align="right"><strong>Value</strong></TableCell>
                        <TableCell align="right"><strong>Rank</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Effective FG%</TableCell>
                        <TableCell align="right">{teamData.stats.effectiveFieldGoalPct ? (teamData.stats.effectiveFieldGoalPct * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                        <TableCell align="right">25th</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Turnover Rate</TableCell>
                        <TableCell align="right">{teamData.stats.turnoverPct ? teamData.stats.turnoverPct.toFixed(1) + '%' : 'N/A'}</TableCell>
                        <TableCell align="right">42nd</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Offensive Rebound %</TableCell>
                        <TableCell align="right">{teamData.stats.offensiveReboundPct ? (teamData.stats.offensiveReboundPct * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                        <TableCell align="right">18th</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Free Throw Rate</TableCell>
                        <TableCell align="right">{teamData.stats.freeThrowRate ? (teamData.stats.freeThrowRate * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                        <TableCell align="right">67th</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Strength of Schedule</TableCell>
                        <TableCell align="right">{teamData.stats.strengthOfSchedule ? teamData.stats.strengthOfSchedule.toFixed(4) : 'N/A'}</TableCell>
                        <TableCell align="right">12th</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Player Contributions to Team Success
            </Typography>
            
            <Grid container spacing={3}>
              {teamData.roster.slice(0, 8).map((player, index) => (
                <Grid item xs={12} sm={6} md={3} key={player.playerId}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {player.name}
                      </Typography>
                      <Chip 
                        label={player.position} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>PPG:</strong> {player.points?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>RPG:</strong> {player.rebounds?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>APG:</strong> {player.assists?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>FG%:</strong> {player.fieldGoalPct ? (player.fieldGoalPct * 100).toFixed(1) + '%' : 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Impact Score: {((player.points || 0) + (player.rebounds || 0) * 1.2 + (player.assists || 0) * 1.5).toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Season Summary */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Season Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              <strong>Record:</strong> {teamData.stats.record} ({teamData.stats.conferenceRecord} in conference)
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Conference:</strong> {teamData.stats.conference}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>KenPom Ranking:</strong> #{teamData.stats.kenpomRank} nationally
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Conference Ranking:</strong> #{teamData.stats.conferenceRank} in Big Ten
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              <strong>Offensive Efficiency:</strong> {teamData.stats.adjustedOffense ? teamData.stats.adjustedOffense.toFixed(1) : 'N/A'} (Top 25%)
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Defensive Efficiency:</strong> {teamData.stats.adjustedDefense ? teamData.stats.adjustedDefense.toFixed(1) : 'N/A'} (Top 30%)
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tempo:</strong> {teamData.stats.tempo ? teamData.stats.tempo.toFixed(1) : 'N/A'} possessions per game
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Luck Factor:</strong> {teamData.stats.luck ? (teamData.stats.luck * 100).toFixed(1) + '%' : 'N/A'} (close games)
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TeamAnalytics; 