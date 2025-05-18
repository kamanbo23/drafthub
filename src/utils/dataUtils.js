//prepare player data by combining bio and measurements
export const preparePlayerData = (players, measurements) => {
  return players.map(player => {
    const playerMeasurements = measurements.find(m => m.playerId === player.playerId) || {};
    
    return {
      ...player,
      ...playerMeasurements
    };
  }).filter(player => {
    return player.heightNoShoes || player.wingspan || player.maxVertical;
  });
};
export const getAvailableMetrics = () => {
  return [
    { key: 'heightNoShoes', label: 'Height (No Shoes)' },
    { key: 'wingspan', label: 'Wingspan' },
    { key: 'reach', label: 'Standing Reach' },
    { key: 'weight', label: 'Weight' },
    { key: 'maxVertical', label: 'Max Vertical' },
    { key: 'noStepVertical', label: 'Standing Vertical' },
    { key: 'agility', label: 'Agility' },
    { key: 'sprint', label: 'Sprint Time' }
  ];
}; 