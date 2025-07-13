import React, { useState, useMemo, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  Grid,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import IllinoisDataService from '../services/illinoisDataService';
import './BigBoard.css';

// Illinois Basketball Big Board
const BigBoard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTableView, setIsTableView] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highSchoolCategory, setHighSchoolCategory] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching Illinois data...');
        const data = await IllinoisDataService.getAllIllinoisData();
        console.log('Data received:', data);
        setPlayerData(data);
      } catch (error) {
        console.error('Error fetching Illinois data:', error);
        // Show error to user instead of using fallback
        alert(`Error fetching data: ${error.message}. Please check the console for details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // helper to format height for display
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // calculate consensus rank for Illinois players
  const getConsensusRank = (playerId) => {
    if (!playerData?.scoutRankings) return 9999;
    
    const rankings = playerData.scoutRankings.find(r => r.playerId === playerId);
    
    if (!rankings) return 9999; // no rankings = put at the end
    
    const validRanks = [
      rankings["ESPN Rank"],
      rankings["Sam Vecenie Rank"],
      rankings["Kevin O'Connor Rank"],
      rankings["Kyle Boone Rank"],
      rankings["Gary Parrish Rank"]
    ].filter(rank => rank !== null);
    
    // if we don't have any ranks, put at end of list
    if (validRanks.length === 0) return 9999;
    
    // calculate average rank
    return Math.round(validRanks.reduce((a, b) => a + b, 0) / validRanks.length);
  };

  // get player stats
  const getPlayerStats = (playerId) => {
    if (!playerData?.game_logs) return { points: 0, rebounds: 0, assists: 0 };
    
    // find all games for this player
    const games = playerData.game_logs.filter(g => g.playerId === playerId) || [];
    if (!games.length) return { points: 0, rebounds: 0, assists: 0 };
    
    // compute totals
    let totalPts = 0, totalRebs = 0, totalAst = 0;
    
    for(let i = 0; i < games.length; i++) {
      const g = games[i];
      // formula from old code: 2pt fg + 3pt + ft
      totalPts += (g.fgm * 2 + g.tpm + g.ftm);
      totalRebs += ((g.oreb || 0) + (g.dreb || 0));
      totalAst += (g.ast || 0);
    }
    
    // get per game avgs
    const numGames = games.length;
    return {
      points: totalPts/numGames,
      rebounds: totalRebs/numGames,
      assists: totalAst/numGames
    };
  };

  // prepare and sort players with memoization
  const sortedPlayers = useMemo(() => {
    if (!playerData?.bio) return [];
    
    // map players with their consensus rank and stats
    const playersWithRank = playerData.bio.map(player => ({
      ...player,
      consensusRank: getConsensusRank(player.playerId),
      stats: getPlayerStats(player.playerId)
    }));
    
    // sort by consensus rank
    return playersWithRank.sort((a, b) => a.consensusRank - b.consensusRank);
  }, [playerData]);

  // Separate current roster and high school players
  const currentRoster = useMemo(() => {
    return sortedPlayers.filter(player => player.currentTeam === 'Illinois');
  }, [sortedPlayers]);

  const highSchoolPlayers = useMemo(() => {
    // Get all recruiting data from the comprehensive API
    const allRecruits = playerData?.recruitingData || [];
    const maxPrepsPlayers = playerData?.highSchoolPlayers ? 
      Object.values(playerData.highSchoolPlayers).flat() : [];
    
    // Combine all high school players
    const combined = [...allRecruits, ...maxPrepsPlayers];
    
    // Remove duplicates based on playerId
    const uniqueRecruits = combined.filter((player, index, self) => 
      index === self.findIndex(p => p.playerId === player.playerId)
    );
    
    return uniqueRecruits;
  }, [playerData]);

  // Get high school players by category - now shows all players but can be filtered
  const getHighSchoolPlayersByCategory = (category) => {
    if (category === 'all') {
      return highSchoolPlayers;
    }
    
    // Filter by category if specified
    return highSchoolPlayers.filter(player => {
      if (category === 'scoring') return player.category === 'scoring' || player.points > 20;
      if (category === 'rebounding') return player.category === 'rebounding' || player.rebounds > 8;
      if (category === 'assists') return player.category === 'assists' || player.assists > 5;
      if (category === 'steals') return player.steals > 2;
      if (category === 'blocks') return player.blocks > 1.5;
      return true;
    });
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCategoryChange = (event) => {
    setHighSchoolCategory(event.target.value);
  };
  
  // filtering logic
  const getFilteredPlayers = (players) => {
    if (searchTerm.trim() === '') {
      return players;
    }
    
    const term = searchTerm.toLowerCase();
    return players.filter(player => 
      player.name.toLowerCase().includes(term) || 
      (player.currentTeam && player.currentTeam.toLowerCase().includes(term)) ||
      (player.highSchool && player.highSchool.toLowerCase().includes(term))
    );
  };

  const handleRowClick = (player) => {
    navigate(`/player/${player.playerId}`, { state: { player } });
  };  

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Illinois Basketball Data...
        </Typography>
      </Container>
    );
  }

  const renderPlayerTable = (players) => (
    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
      <Table stickyHeader aria-label="illinois basketball big board">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Team/School</TableCell>
            <TableCell align="right">PTS</TableCell>
            <TableCell align="right">REB</TableCell>
            <TableCell align="right">AST</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.length > 0 ? (
            players.map((player, index) => (
              <TableRow 
                key={player.playerId} 
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.03)' }
                }}
              >
                <TableCell>
                  {player.rank || player.consensusRank !== 9999 ? (player.rank || player.consensusRank) : '-'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {player.isRecruit ? <SchoolIcon color="primary" /> : <SportsBasketballIcon color="secondary" />}
                    {player.name}
                    {player.category && (
                      <Chip 
                        label={player.category.toUpperCase()} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{player.position || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={player.currentTeam} 
                    color={player.isRecruit ? "primary" : "secondary"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {player.isRecruit ? player.points?.toFixed(1) : player.stats.points.toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {player.isRecruit ? player.rebounds?.toFixed(1) : player.stats.rebounds.toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {player.isRecruit ? player.assists?.toFixed(1) : player.stats.assists.toFixed(1)}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleRowClick(player)}
                    size="small"
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No players found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPlayerCards = (players) => (
    <Grid container spacing={3}>
      {players.length > 0 ? (
        players.map((player) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.playerId}>
            <PlayerCard 
              player={player}
              onClick={() => handleRowClick(player)}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6" align="center" color="text.secondary">
            No players found matching your search criteria.
          </Typography>
        </Grid>
      )}
    </Grid>
  );

  const getCategoryDisplayName = (category) => {
    const names = {
      all: 'All High School Players',
      scoring: 'Scoring Leaders (20+ PPG)',
      rebounding: 'Rebounding Leaders (8+ RPG)',
      assists: 'Assist Leaders (5+ APG)',
      steals: 'Steal Leaders (2+ SPG)',
      blocks: 'Block Leaders (1.5+ BPG)'
    };
    return names[category] || category;
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
          fontWeight: 'bold', 
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        Illinois Basketball Big Board
      </Typography>
      
      <Box sx={{ 
        maxWidth: '500px', 
        margin: '0 auto 20px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <TextField 
          label="Search players by name, school, or team"
          variant="outlined"
          fullWidth
          placeholder="Search by name, school, or team"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isTableView}
              onChange={(e) => setIsTableView(e.target.checked)}
              color="primary"
            />
          }
          label={isTableView ? "Table View" : "Card View"}
          sx={{ alignSelf: 'center' }}
        />
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            label={`Current Roster (${getFilteredPlayers(currentRoster).length})`} 
            icon={<SportsBasketballIcon />}
          />
          <Tab 
            label={`High School Players (${getFilteredPlayers(highSchoolPlayers).length})`} 
            icon={<SchoolIcon />}
          />
        </Tabs>
      </Box>

      {/* High School Category Selector */}
      {activeTab === 1 && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Statistical Category</InputLabel>
            <Select
              value={highSchoolCategory}
              label="Statistical Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All Players (56 Total)</MenuItem>
              <MenuItem value="scoring">Scoring Leaders (20+ PPG)</MenuItem>
              <MenuItem value="rebounding">Rebounding Leaders (8+ RPG)</MenuItem>
              <MenuItem value="assists">Assist Leaders (5+ APG)</MenuItem>
              <MenuItem value="steals">Steal Leaders (2+ SPG)</MenuItem>
              <MenuItem value="blocks">Block Leaders (1.5+ BPG)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      
      {activeTab === 0 ? (
        isTableView ? 
          renderPlayerTable(getFilteredPlayers(currentRoster)) : 
          renderPlayerCards(getFilteredPlayers(currentRoster))
      ) : (
        isTableView ? 
          renderPlayerTable(getFilteredPlayers(getHighSchoolPlayersByCategory(highSchoolCategory))) : 
          renderPlayerCards(getFilteredPlayers(getHighSchoolPlayersByCategory(highSchoolCategory)))
      )}

      {/* Category Summary */}
      {activeTab === 1 && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            {getCategoryDisplayName(highSchoolCategory)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing top high school players in {getCategoryDisplayName(highSchoolCategory).toLowerCase()}. 
            Data sourced from MaxPreps with fallback to curated statistics.
              </Typography>
        </Box>
      )}
    </Container>
  );
};

export default BigBoard; 