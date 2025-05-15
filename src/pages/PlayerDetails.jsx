import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './PlayerDetails.css';
import playerData from '../intern_project_data.json';

const PlayerDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(location.state?.player);
  const [scoutRankings, setScoutRankings] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [scoutName, setScoutName] = useState('');
  const [reportContent, setReportContent] = useState('');
  
  useEffect(() => {
    // If player wasn't passed through state, try to find by ID
    if (!player && id) {
      const foundPlayer = playerData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      }
    }
    
    if (player || id) {
      const playerId = player?.playerId || parseInt(id);
      
      // Get scout rankings
      const rankings = playerData.scoutRankings?.find(r => r.playerId === playerId);
      setScoutRankings(rankings);
      
      // Get measurements
      const playerMeasurements = playerData.measurements?.find(m => m.playerId === playerId);
      setMeasurements(playerMeasurements);
    }
  }, [player, id]);
  
  const handleReportSubmit = (e) => {
    e.preventDefault();
    
    if (scoutName.trim() === '' || reportContent.trim() === '') {
      alert('Please fill out both the scout name and report fields');
      return;
    }
    
    const newReport = {
      scout: scoutName,
      report: reportContent,
      date: new Date().toLocaleDateString()
    };
    
    setUserReports([newReport, ...userReports]);
    setScoutName('');
    setReportContent('');
  };
  
  if (!player) {
    return (
      <div className="player-not-found">
        <h2>Player Not Found</h2>
        <button onClick={() => navigate('/big-board')}>
          Back to Big Board
        </button>
      </div>
    );
  }
  
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  
  return (
    <div className="player-details">
      <button className="back-button" onClick={() => navigate('/big-board')}>
        Back to Big Board
      </button>
      
      <div className="player-profile">
        <div className="player-header">
          <div className="player-title">
            <h1>{player.name}</h1>
            {scoutRankings && (
              <div className="scout-consensus">
                <span>Consensus Rank: {Math.round((
                  scoutRankings["ESPN Rank"] +
                  scoutRankings["Sam Vecenie Rank"] +
                  scoutRankings["Kevin O'Connor Rank"] +
                  scoutRankings["Kyle Boone Rank"] +
                  scoutRankings["Gary Parrish Rank"]
                ) / 5)}</span>
              </div>
            )}
          </div>
          <div className="player-image">
            <img 
              src={player.photoUrl} 
              alt={player.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300';
              }}
            />
          </div>
        </div>
        
        <div className="player-info-grid">
          <div className="player-bio">
            <h2>Player Bio</h2>
            <p><strong>Team:</strong> {player.currentTeam}</p>
            <p><strong>Height:</strong> {formatHeight(player.height)}</p>
            <p><strong>Weight:</strong> {player.weight} lbs</p>
            <p><strong>League:</strong> {player.league}</p>
            <p><strong>From:</strong> {player.homeTown}, {player.homeState || player.homeCountry}</p>
            <p><strong>High School:</strong> {player.highSchool || 'N/A'}</p>
            
            {scoutRankings && (
              <div className="rankings-section">
                <h3>Scout Rankings</h3>
                <p><strong>ESPN:</strong> #{scoutRankings["ESPN Rank"]}</p>
                <p><strong>Sam Vecenie:</strong> #{scoutRankings["Sam Vecenie Rank"]}</p>
                <p><strong>Kevin O'Connor:</strong> #{scoutRankings["Kevin O'Connor Rank"]}</p>
                <p><strong>Kyle Boone:</strong> #{scoutRankings["Kyle Boone Rank"]}</p>
                <p><strong>Gary Parrish:</strong> #{scoutRankings["Gary Parrish Rank"]}</p>
              </div>
            )}
            
            {measurements && (
              <div className="measurements-section">
                <h3>Measurements</h3>
                <p><strong>Height (w/o shoes):</strong> {formatHeight(measurements.heightNoShoes)}</p>
                <p><strong>Wingspan:</strong> {formatHeight(measurements.wingspan)}</p>
                <p><strong>Standing Reach:</strong> {formatHeight(measurements.reach)}</p>
                <p><strong>Max Vertical:</strong> {measurements.maxVertical}" </p>
                <p><strong>Standing Vertical:</strong> {measurements.noStepVertical}"</p>
              </div>
            )}
          </div>
          
          <div className="player-analysis">
            <h2>Player Analysis</h2>
            
            <div className="player-summary">
              <p>
                {player.name} is a {formatHeight(player.height)} {player.position || 'player'} currently with {player.currentTeam} in the {player.league}.
                {measurements && measurements.wingspan > measurements.heightNoShoes + 2 && ' He has excellent length for his position.'}
                {measurements && measurements.maxVertical > 35 && ' His vertical leap shows elite athleticism.'}
              </p>
            </div>
            
            <div className="data-viz-section">
              <button 
                className="data-viz-button"
                onClick={() => navigate('/data-viz', { state: { player } })}
              >
                View Data Visualization
              </button>
            </div>
          </div>
        </div>
        
        {/* User Scouting Reports Section */}
        <div className="reports-section">
          <h2>Scouting Reports</h2>
          
          <div className="user-reports">
            {userReports.length > 0 ? (
              <div className="reports-list">
                {userReports.map((report, index) => (
                  <div key={index} className="report">
                    <div className="report-header">
                      <h3>{report.scout}</h3>
                      <span className="report-date">{report.date}</span>
                    </div>
                    <p>{report.report}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reports">No scouting reports available for this player. Add the first one below!</p>
            )}
          </div>
          
          <div className="add-report">
            <h3>Add Your Scouting Report</h3>
            <form onSubmit={handleReportSubmit} className="report-form">
              <div className="form-field">
                <label htmlFor="scout-name">Scout Name:</label>
                <input 
                  type="text" 
                  id="scout-name" 
                  value={scoutName}
                  onChange={(e) => setScoutName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="report">Scouting Report:</label>
                <textarea 
                  id="report" 
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder="Share your analysis of this player..."
                  rows="4" 
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-report">Submit Report</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails; 