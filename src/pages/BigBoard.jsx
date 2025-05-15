import React from 'react';
import PlayerCard from '../components/PlayerCard';
import playerData from '../intern_project_data.json';
import './BigBoard.css';

const BigBoard = () => {
  return (
    <div className="big-board">
      <h2>NBA Draft Big Board</h2>
      <div className="player-grid">
        {playerData.bio.map((player) => (
          <PlayerCard key={player.playerId} player={player} />
        ))}
      </div>
    </div>
  );
};

export default BigBoard; 