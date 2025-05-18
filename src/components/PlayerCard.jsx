import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerCard.css';
import playerData from '../intern_project_data.json';

// card component for showing basic player info
// clicking takes you to the full details page
const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const [scoutingReports, setScoutingReports] = useState([]);

  // load reports when component mounts
  useEffect(() => {
    const reports = playerData.scoutingReports 
      ? playerData.scoutingReports.filter(r => r.playerId === player.playerId) 
      : [];
      
    setScoutingReports(reports);
    // console.log(`Found ${reports.length} reports for ${player.name}`);
  }, [player.playerId]);
  
  // copied this from StackOverflow and tweaked
  function formatHeight(inches) {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  }

  // navigation handler
  const handleViewDetails = () => {
    // pass the player data through state to avoid another fetch
    navigate(`/player/${player.playerId}`, { state: { player } });
  };

  // backup in case the image fails to load for some reason
  const handleImageError = (e) => {
    e.target.src = '/placeholder-user.svg';
  };

  // choose the right image source based on whether player has a photo
  const getImageSrc = () => {
    return player.photoUrl || '/placeholder-user.svg';
  };

  return (
    <div className="player-card">
      <div className="player-image">
        <img 
          src={getImageSrc()} 
          alt={`${player.name} photo`}
          onError={handleImageError}
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
          
          {scoutingReports.length > 0 ? (
            <div className="card-scouting-reports">
              <h4>Scouting Reports:</h4>
              {scoutingReports.map((report, index) => (
                <div key={index} className="card-report">
                  <p><strong>{report.scout}:</strong> {report.report.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reports-message">
              <p>No reports yet - add yours on the details page!</p>
            </div>
          )}

          <button onClick={handleViewDetails}>View Player Details</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 