import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerCard.css';

// Illinois Basketball Player Card Component
const PlayerCard = ({ player, onClick }) => {
  const navigate = useNavigate();
  const [scoutingReports, setScoutingReports] = useState([]);

  // load reports when component mounts
  useEffect(() => {
    // For now, we'll generate a simple report since we don't have the full data service here
    const reports = [{
      scout: "Illinois Basketball Staff",
      report: `${player.name} shows great potential for the Illinois basketball program. ${player.position || 'Player'} with solid fundamentals and team-first mentality.`
    }];
    setScoutingReports(reports);
  }, [player.playerId, player.name, player.position]);
  
  // format height helper
  function formatHeight(inches) {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  }

  // navigation handler
  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else {
    // pass the player data through state to avoid another fetch
    navigate(`/player/${player.playerId}`, { state: { player } });
    }
  };

  // backup in case the image fails to load for some reason
  const handleImageError = (e) => {
    e.target.src = '/placeholder-user.svg';
  };

  // choose the right image source based on whether player has a photo
  const getImageSrc = () => {
    return player.photoUrl || '/placeholder-user.svg';
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    const names = {
      scoring: 'Scoring',
      rebounding: 'Rebounding',
      assists: 'Assists',
      steals: 'Steals',
      blocks: 'Blocks'
    };
    return names[category] || category;
  };

  // Get primary stat display
  const getPrimaryStatDisplay = () => {
    if (!player.category || !player.primaryStat) return null;
    
    const statNames = {
      scoring: 'PPG',
      rebounding: 'RPG',
      assists: 'APG',
      steals: 'SPG',
      blocks: 'BPG'
    };
    
    return `${player.primaryStat.toFixed(1)} ${statNames[player.category]}`;
  };

  return (
    <div className="player-card" onClick={handleViewDetails}>
      <div className="player-image">
        <img 
          src={getImageSrc()} 
          alt={`${player.name} photo`}
          onError={handleImageError}
        />
        {player.isRecruit && (
          <div className="recruit-badge">
            <span>Recruit</span>
          </div>
        )}
        {player.category && (
          <div className="category-badge">
            <span>{getCategoryDisplayName(player.category)}</span>
          </div>
        )}
      </div>
      <div className="player-info">
        <h3>{player.name}</h3>
        <div className="player-details">
          <p><strong>Team:</strong> {player.currentTeam}</p>
          {player.position && <p><strong>Position:</strong> {player.position}</p>}
          <p><strong>Height:</strong> {formatHeight(player.height)}</p>
          <p><strong>Weight:</strong> {player.weight ? `${player.weight} lbs` : 'N/A'}</p>
          <p><strong>League:</strong> {player.league}</p>
          {player.year && <p><strong>Year:</strong> {player.year}</p>}
          {player.rank && <p><strong>Rank:</strong> #{player.rank}</p>}
          {player.highSchool && <p><strong>High School:</strong> {player.highSchool}</p>}
          {player.highSchoolState && <p><strong>State:</strong> {player.highSchoolState}</p>}
          
          {/* Primary Stat Display for High School Players */}
          {player.isRecruit && player.category && player.primaryStat && (
            <div className="primary-stat">
              <p><strong>{getCategoryDisplayName(player.category)}:</strong> {getPrimaryStatDisplay()}</p>
            </div>
          )}
          
          {/* Stats Grid for High School Players */}
          {player.isRecruit && (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">PTS</span>
                <span className="stat-value">{player.points?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">REB</span>
                <span className="stat-value">{player.rebounds?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AST</span>
                <span className="stat-value">{player.assists?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STL</span>
                <span className="stat-value">{player.steals?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">BLK</span>
                <span className="stat-value">{player.blocks?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
          )}
          
          {scoutingReports.length > 0 ? (
            <div className="card-scouting-reports">
              <h4>Scouting Report:</h4>
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

          <button onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}>
            View Player Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 