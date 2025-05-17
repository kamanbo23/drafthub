import React from 'react';
import PlayerCard from '../components/PlayerCard';
import playerData from '../intern_project_data.json';
import { Typography, Box, Container } from '@mui/material';
import './BigBoard.css';

//  all players in a grid
const BigBoard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" color="primary" sx={{ mb: 6 }}>
        NBA Draft Big Board
      </Typography>
      <Box className="player-grid">
        {playerData.bio.map((player) => (
          <PlayerCard key={player.playerId} player={player} />
        ))}
      </Box>
    </Container>
  );
};

export default BigBoard; 