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
  const [stats, setStats] = useState([]);
  const [scoutingReports, setScoutingReports] = useState([]);
  
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
      
      // Get game logs (can be multiple entries)
      const playerStats = playerData.game_logs ? playerData.game_logs.filter(s => s.playerId === playerId) : [];
      setStats(playerStats);
      
      // Get scouting reports
      const reports = playerData.scoutingReports ? playerData.scoutingReports.filter(r => r.playerId === playerId) : [];
      setScoutingReports(reports);
    }
  }, [player, id]);
  
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
  
  // Generate player strengths and weaknesses based on their stats
  const generateStrengths = () => {
    if (!stats.length) return ["No data available"];
    
    const strengths = [];
    const recentStats = stats[0]; // Use most recent stats
    
    if (recentStats) {
      if (recentStats["3P%"] > 36) {
        strengths.push("Excellent three-point shooter");
      }
      if (recentStats.AST > 4) {
        strengths.push("Strong playmaker");
      }
      if (recentStats.TRB > 7) {
        strengths.push("Elite rebounder");
      }
      if (recentStats.STL > 1.5) {
        strengths.push("Disruptive defender");
      }
      if (recentStats.BLK > 1) {
        strengths.push("Good shot blocker");
      }
      if (recentStats["FG%"] > 50) {
        strengths.push("Efficient scorer");
      }
    }
    
    if (measurements && measurements.wingspan > measurements.heightShoes + 3) {
      strengths.push("Excellent length");
    }
    
    return strengths.length ? strengths : ["Not enough data to determine strengths"];
  };
  
  const generateWeaknesses = () => {
    if (!stats.length) return ["No data available"];
    
    const weaknesses = [];
    const recentStats = stats[0]; // Use most recent stats
    
    if (recentStats) {
      if (recentStats["3P%"] < 33 && recentStats["3PA"] > 2) {
        weaknesses.push("Inconsistent three-point shooter");
      }
      if (recentStats.TOV > 3) {
        weaknesses.push("Turnover prone");
      }
      if (recentStats["FTP"] < 70) {
        weaknesses.push("Poor free throw shooter");
      }
      if (recentStats.PF > 3) {
        weaknesses.push("Foul trouble concerns");
      }
    }
    
    return weaknesses.length ? weaknesses : ["Not enough data to determine weaknesses"];
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
          
          <div className="scouting-report">
            <h2>Scouting Report</h2>
            
            {scoutingReports.length > 0 ? (
              <div className="reports">
                {scoutingReports.map((report, index) => (
                  <div key={index} className="report">
                    <h3>Report by {report.scout}</h3>
                    <p>{report.report}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No official scouting reports available for {player.name}.</p>
            )}
            
            <div className="strengths">
              <h3>Strengths</h3>
              <ul>
                {generateStrengths().map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="weaknesses">
              <h3>Weaknesses</h3>
              <ul>
                {generateWeaknesses().map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {stats.length > 0 && (
          <div className="stats-section">
            <h2>Recent Statistics</h2>
            <div className="stats-table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Season</th>
                    <th>League</th>
                    <th>Team</th>
                    <th>GP</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>BLK</th>
                    <th>FG%</th>
                    <th>3P%</th>
                    <th>FT%</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.Season}</td>
                      <td>{stat.League}</td>
                      <td>{stat.Team}</td>
                      <td>{stat.GP}</td>
                      <td>{stat.MP}</td>
                      <td>{stat.PTS}</td>
                      <td>{stat.TRB}</td>
                      <td>{stat.AST}</td>
                      <td>{stat.STL}</td>
                      <td>{stat.BLK}</td>
                      <td>{stat["FG%"]}</td>
                      <td>{stat["3P%"]}</td>
                      <td>{stat["FTP"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails; 