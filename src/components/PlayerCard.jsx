import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import './PlayerCard.css';
import playerData from '../intern_project_data.json';

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const [scoutingReports, setScoutingReports] = useState([]);

  useEffect(() => {
    // Get scouting reports for this player
    const reports = playerData.scoutingReports ? 
      playerData.scoutingReports.filter(r => r.playerId === player.playerId) : 
      [];
    setScoutingReports(reports);
  }, [player.playerId]);
  
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const handleViewDetails = () => {
    navigate(`/player/${player.playerId}`, { state: { player } });
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
          <p><strong>Player ID:</strong> {player.playerId}</p>
          <p><strong>Report Count:</strong> {scoutingReports.length}</p>
          
          {scoutingReports.length > 0 && (
            <div className="card-scouting-reports">
              <h4>Scouting Reports:</h4>
              {scoutingReports.map((report, index) => (
                <div key={index} className="card-report">
                  <p><strong>{report.scout}:</strong> {report.report.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleViewDetails}>View Details and Scouting Reports</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 