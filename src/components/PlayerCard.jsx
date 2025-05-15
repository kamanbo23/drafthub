import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player }) => {
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  return (
    <div className="player-card">
      <div className="player-image">
        <img 
          src={player.photoUrl} 
          alt={player.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
      </div>
      <div className="player-info">
        <h3>{player.name}</h3>
        <div className="player-details">
          <p><strong>Team:</strong> {player.currentTeam}</p>
          <p><strong>Height:</strong> {formatHeight(player.height)}</p>
          <p><strong>Weight:</strong> {player.weight} lbs</p>
          <p><strong>League:</strong> {player.league}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 