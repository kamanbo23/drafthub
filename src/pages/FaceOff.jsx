import React, { useState } from 'react';
import { Box, Typography, Container, Button, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import playerData from '../intern_project_data.json';
import { useNavigate } from 'react-router-dom';

// my list of important stats to show in the comparison 
const coreStats = [
  { key: 'points', label: 'Points' },
  { key: 'rebounds', label: 'Rebounds' },
  { key: 'assists', label: 'Assists' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'wingspan', label: 'Wingspan' },
  // todo: add more stats here maybe 3pt%?
];

// convert inches to feet'inches"
function formatHeight(inches) {
  if (!inches) return 'N/A';
  const feet = Math.floor(inches / 12);
  const remaining = inches % 12;
  return `${feet}'${remaining}"`;
}

// calculates ppg, rpg, apg from game logs
function getAverageStats(playerid) {
  // find all games for this player
  const games = playerData.game_logs?.filter(g => g.playerId === playerid) || [];
  if (!games.length) return { points: '-', rebounds: '-', assists: '-' };
  
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
    points: (totalPts/numGames).toFixed(1),
    rebounds: (totalRebs/numGames).toFixed(1),
    assists: (totalAst/numGames).toFixed(1)
  };
}

const FaceOff = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const nav = useNavigate();

  // grab player info based on ids
  const selectedPlayers = selectedIds.map(id => playerData.bio.find(p => p.playerId === id));
  // need measurements for wingspan etc
  const playerMeasures = selectedIds.map(id => playerData.measurements.find(m => m.playerId === id));

  // update selected players when dropdown changes
  function handleDropdownChange(idx, value) {
    let newSelected = [...selectedIds];
    newSelected[idx] = value;
    // filter out empty slots
    setSelectedIds(newSelected.filter(id => id)); 
  };

  // helper to get any stat based on the key
  function getPlayerStat(p, m, statKey) {
    if (!p) return '';
    
    // handle special stats
    if (statKey === 'height') return formatHeight(p.height);
    if (statKey === 'weight') return p.weight;
    if (statKey === 'wingspan') return m ? formatHeight(m.wingspan) : '-';
    
    // handle game averages
    if (['points', 'rebounds', 'assists'].includes(statKey)) {
      const avgStats = getAverageStats(p.playerId);
      return avgStats[statKey];
    }
    
    // generic fallback 
    return p[statKey] !== undefined ? p[statKey] : '';
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => nav('/data-viz')} sx={{ mb: 2 }}>&larr; Back to Data Visualization</Button>
      
      <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 600 }}>
        Face Off
      </Typography>
      
      <Typography align="center" sx={{ mb: 3, color: 'text.secondary' }}>
        Pick 2 or 3 players to compare their stats side by side.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
        {[0, 1, 2].map(idx => (
          <FormControl key={idx} sx={{ minWidth: 180 }}>
            <InputLabel>{`Player ${idx + 1}`}</InputLabel>
            <Select
              value={selectedIds[idx] || ''}
              label={`Player ${idx + 1}`}
              onChange={e => handleDropdownChange(idx, e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {playerData.bio.map(p => (
                <MenuItem key={p.playerId} value={p.playerId}>
                  {p.name} - {p.currentTeam || '?'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
      
      {selectedPlayers.filter(Boolean).length >= 2 && (
        <Paper sx={{ p: 2, borderRadius: 2, overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', mb: 1 }}>
            <Box sx={{ width: 140, fontWeight: 600 }}>Stat</Box>
            {selectedPlayers.map((player, i) => (
              <Box key={i} sx={{ width: 160, fontWeight: 600, textAlign: 'center' }}>
                {player ? player.name : ''}
              </Box>
            ))}
          </Box>
          {coreStats.map(stat => (
            <Box key={stat.key} sx={{ display: 'flex', borderBottom: '1px solid #f5f5f5', py: 1 }}>
              <Box sx={{ width: 140 }}>{stat.label}</Box>
              {selectedPlayers.map((p, i) => (
                <Box key={i} sx={{ width: 160, textAlign: 'center', fontWeight: 'bold', color: '#2565c0' }}>
                  {getPlayerStat(p, playerMeasures[i], stat.key)}
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default FaceOff; 