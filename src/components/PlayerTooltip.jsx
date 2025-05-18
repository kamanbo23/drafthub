import React from 'react';

// basic tooltip component for displaying player info on hover
const PlayerTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const player = payload[0].payload;

  // format height from inches to feet and inches
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{player.name}</p>
      <p style={{ margin: 0 }}>{player.currentTeam}</p>
      <p style={{ margin: 0 }}>Height: {formatHeight(player.heightNoShoes)}</p>
      <p style={{ margin: 0 }}>Wingspan: {formatHeight(player.wingspan)}</p>
      {player.maxVertical && <p style={{ margin: 0 }}>Vertical: {player.maxVertical}"</p>}
    </div>
  );
};

export default PlayerTooltip; 