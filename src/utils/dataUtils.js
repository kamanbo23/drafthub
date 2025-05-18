//prepare player data by combining bio and measurements
// created 5/15/2025 - needs cleanup potentially
export const preparePlayerData = (players, measurements) => {
  // merge player bio with their physical measurements
  return players.map(player => {
    // find matching measurements or use empty object if none exist
    let playerMeasurements = measurements.find(m => m.playerId === player.playerId) || {};
    
    // combine the data
    return {
      ...player,
      ...playerMeasurements
    };
  }).filter(player => {
    // only include players that have at least some measurement data
    return player.heightNoShoes || player.wingspan || player.maxVertical;
  });
};

// list of metrics we can show in the scatter plot
export const getAvailableMetrics = () => {
  return [
    { key: 'heightNoShoes', label: 'Height (No Shoes)' },
    { key: 'wingspan', label: 'Wingspan' },
    { key: 'reach', label: 'Standing Reach' },
    { key: 'weight', label: 'Weight' },
    { key: 'maxVertical', label: 'Max Vertical' },
    { key: 'noStepVertical', label: 'Standing Vertical' },
    // might add more here later if we get the data
    { key: 'agility', label: 'Agility' },
    { key: 'sprint', label: 'Sprint Time' }
  ];
}; 