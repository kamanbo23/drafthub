import React, { useState } from 'react';
import PlayerCard from '../components/PlayerCard';
import playerData from '../intern_project_data.json';
import { Typography, Box, Container, TextField } from '@mui/material';
import './BigBoard.css';

// trying to get all players to show up in a nice grid layout
const BigBoard = () => {
  // player search - added this last minute
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // console.log('search changed:', e.target.value); // this helped debug the weird filtering issue
  };
  
  // Simple filter logic - case insensitive search on name/team/position
  let filteredPlayers = playerData.bio;
  
  // only filter if there's actually a search term
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filteredPlayers = playerData.bio.filter(player => 
      player.name.toLowerCase().includes(term) || 
      (player.currentTeam && player.currentTeam.toLowerCase().includes(term)) || 
      (player.position && player.position.toLowerCase().includes(term))
    );
  }

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
      
      {/* search box - might make this more advanced later */}
      <Box sx={{ maxWidth: '500px', margin: '0 auto 20px auto' }}>
        <TextField 
          label="Search players"
          variant="outlined"
          fullWidth
          placeholder="Name, team, or position"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      
      <Box className="player-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <PlayerCard key={player.playerId} player={player} />
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
            <Typography variant="h6">
              No players found! Try something else.
            </Typography>
          </div>
        )}
      </Box>
    </Container>
  );
};

export default BigBoard; 