import React, { useState, useMemo } from 'react';
import playerData from '../intern_project_data.json';
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
  IconButton
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import './BigBoard.css';

// Big Board with a table layout
const BigBoard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // helper to format height for display
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // calculate consensus rank - maybe move this to utils later
  const getConsensusRank = (playerId) => {
    const rankings = playerData.scoutRankings?.find(r => r.playerId === playerId);
    
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
    // find all games for this player
    const games = playerData.game_logs?.filter(g => g.playerId === playerId) || [];
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
  
  // prepare and sort players with memoization so we don't recalculate every render
  const sortedPlayers = useMemo(() => {
    // map players with their consensus rank and stats
    const playersWithRank = playerData.bio.map(player => ({
      ...player,
      consensusRank: getConsensusRank(player.playerId),
      stats: getPlayerStats(player.playerId)
    }));
    
    // sort by consensus rank
    return playersWithRank.sort((a, b) => a.consensusRank - b.consensusRank);
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // filtering logic
  let filteredPlayers = sortedPlayers;
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filteredPlayers = sortedPlayers.filter(player => 
      player.name.toLowerCase().includes(term) || 
      (player.currentTeam && player.currentTeam.toLowerCase().includes(term))
    );
  }

  const handleRowClick = (player) => {
    navigate(`/player/${player.playerId}`, { state: { player } });
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
        NBA Draft Big Board
      </Typography>
      
      <Box sx={{ maxWidth: '500px', margin: '0 auto 20px auto' }}>
        <TextField 
          label="Search players by name or school/team"
          variant="outlined"
          fullWidth
          placeholder="Search by name or school/team"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
        <Table stickyHeader aria-label="draft big board">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">PTS</TableCell>
              <TableCell align="right">REB</TableCell>
              <TableCell align="right">AST</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => (
                <TableRow 
                  key={player.playerId} 
                  hover
                  sx={{ 
                    cursor: 'pointer',
                    '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.03)' }
                  }}
                >
                  <TableCell>{player.consensusRank !== 9999 ? player.consensusRank : '-'}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{player.name}</TableCell>
                  <TableCell>{player.currentTeam || '-'}</TableCell>
                  <TableCell align="right">{player.stats.points.toFixed(1)}</TableCell>
                  <TableCell align="right">{player.stats.rebounds.toFixed(1)}</TableCell>
                  <TableCell align="right">{player.stats.assists.toFixed(1)}</TableCell>
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
                <TableCell colSpan={7} align="center">
                  <Typography variant="h6">
                    No players found! Try something else.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BigBoard; 