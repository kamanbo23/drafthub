import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PlayerDetails.css';
import playerData from '../intern_project_data.json';

//  player page with stats, reports
// future backend plans if extended project add ability to save reports to database
const PlayerDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(location.state?.player);
  const [scoutRankings, setScoutRankings] = useState(null);
  const [consensusRank, setConsensusRank] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [scoutingReports, setScoutingReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [scoutName, setScoutName] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [playerGameData, setPlayerGameData] = useState([]);
  const [statType, setStatType] = useState('points');
  const [dateRange, setDateRange] = useState('all');
  
  useEffect(() => {
    if (!player && id) {
      const foundPlayer = playerData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      }
    }
    
    if (player || id) {
      const playerId = player?.playerId || parseInt(id);
      
      //  scout rankings
      const rankings = playerData.scoutRankings?.find(r => r.playerId === playerId);
      setScoutRankings(rankings);
      
      //  consensus rank
      if (rankings) {
        const validRanks = [
          rankings["ESPN Rank"],
          rankings["Sam Vecenie Rank"],
          rankings["Kevin O'Connor Rank"],
          rankings["Kyle Boone Rank"],
          rankings["Gary Parrish Rank"]
        ].filter(rank => rank !== null);
        
        if (validRanks.length > 0) {
          const consensus = Math.round(validRanks.reduce((a, b) => a + b, 0) / validRanks.length);
          setConsensusRank(consensus);
        }
      }
      
      //  measurements
      const playerMeasurements = playerData.measurements?.find(m => m.playerId === playerId);
      setMeasurements(playerMeasurements);

      //  scouting reports
      const reports = playerData.scoutingReports?.filter(r => r.playerId === playerId) || [];
      setScoutingReports(reports);
      
      const gameLogs = playerData.game_logs?.filter(game => game.playerId === playerId) || [];
      const sortedGames = [...gameLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // transform for chart display - simplify data
      const chartData = sortedGames.map(game => {
        const gameDate = new Date(game.date);
        return {
          date: gameDate.toLocaleDateString(),
          points: game.fgm * 2 + game.tpm + game.ftm, // approximate points if not directly provided
          rebounds: (game.oreb || 0) + (game.dreb || 0),
          assists: game.ast || 0,
          steals: game.stl || 0,
          blocks: game.blk || 0
        };
      });
      
      setPlayerGameData(chartData);
    }
  }, [player, id]);

  // handle filtering data based on date range
  const getFilteredData = () => {
    if (dateRange === 'all' || playerGameData.length === 0) {
      return playerGameData;
    }
    
    const today = new Date();
    let cutoffDate = new Date();
    
    if (dateRange === 'month') {
      cutoffDate.setMonth(today.getMonth() - 1);
    } else if (dateRange === '3months') {
      cutoffDate.setMonth(today.getMonth() - 3);
    }
    
    return playerGameData.filter(game => new Date(game.date) >= cutoffDate);
  };

  // this isn't doing anything yet - just adds to local state
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
  
  // could make this better later
  const renderRankComparison = (rank) => {
    if (rank === null || consensusRank === null) return null;
    
    if (rank < consensusRank) {
      return <span className="rank-higher">Higher than consensus ▲</span>;
    } else if (rank > consensusRank) {
      return <span className="rank-lower">Lower than consensus ▼</span>;
    }
    return null;
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
            {consensusRank && (
              <div className="scout-consensus">
                <span>Consensus Rank: {consensusRank}</span>
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
                <p>
                  <strong>ESPN:</strong> {scoutRankings["ESPN Rank"] !== null 
                    ? <>#{scoutRankings["ESPN Rank"]} {renderRankComparison(scoutRankings["ESPN Rank"])}</>
                    : <span className="not-ranked">Not Ranked</span>}
                </p>
                
                <p>
                  <strong>Sam Vecenie:</strong> {scoutRankings["Sam Vecenie Rank"] !== null 
                    ? <>#{scoutRankings["Sam Vecenie Rank"]} {renderRankComparison(scoutRankings["Sam Vecenie Rank"])}</>
                    : <span className="not-ranked">Not Ranked</span>}
                </p>
                
                <p>
                  <strong>Kevin O'Connor:</strong> {scoutRankings["Kevin O'Connor Rank"] !== null 
                    ? <>#{scoutRankings["Kevin O'Connor Rank"]} {renderRankComparison(scoutRankings["Kevin O'Connor Rank"])}</>
                    : <span className="not-ranked">Not Ranked</span>}
                </p>
                
                <p>
                  <strong>Kyle Boone:</strong> {scoutRankings["Kyle Boone Rank"] !== null 
                    ? <>#{scoutRankings["Kyle Boone Rank"]} {renderRankComparison(scoutRankings["Kyle Boone Rank"])}</>
                    : <span className="not-ranked">Not Ranked</span>}
                </p>
                
                <p>
                  <strong>Gary Parrish:</strong> {scoutRankings["Gary Parrish Rank"] !== null 
                    ? <>#{scoutRankings["Gary Parrish Rank"]} {renderRankComparison(scoutRankings["Gary Parrish Rank"])}</>
                    : <span className="not-ranked">Not Ranked</span>}
                </p>
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
              <h3>Performance Trends</h3>
              
              <div className="chart-controls">
                <div className="control-group">
                  <label>Stat: </label>
                  <select value={statType} onChange={(e) => setStatType(e.target.value)}>
                    <option value="points">Points</option>
                    <option value="rebounds">Rebounds</option>
                    <option value="assists">Assists</option>
                    <option value="steals">Steals</option>
                    <option value="blocks">Blocks</option>
                  </select>
                </div>
                
                <div className="control-group">
                  <label>Period: </label>
                  <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="3months">Last 3 Months</option>
                  </select>
                </div>
              </div>
              
              {playerGameData.length > 0 ? (
                <div className="performance-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={getFilteredData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={statType} 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        name={statType.charAt(0).toUpperCase() + statType.slice(1)}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="no-data">No performance data available for this player.</p>
              )}
              
              <div className="action-buttons">
                <button 
                  className="projection-button"
                  onClick={() => navigate(`/player/${player.playerId}/projection`, { state: { player } })}
                >
                  View Mavericks Projection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scouting Reports Section */}
        <div className="reports-section">
          <h2>Scouting Reports</h2>
          
          <div className="user-reports">
            {scoutingReports.length > 0 ? (
              <div className="reports-list">
                {scoutingReports.map((report, index) => (
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
                  placeholder="Write your scouting report here..."
                  required
                />
              </div>
              
              <button type="submit">Submit Report</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;