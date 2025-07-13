import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PlayerDetails.css';
import IllinoisDataService from '../services/illinoisDataService';

// Illinois Basketball Player Details Page
const PlayerDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(location.state?.player);
  const [playerData, setPlayerData] = useState(null);

  const [scoutingReports, setScoutingReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  // form inputs
  const [scoutName, setScoutName] = useState('');
  const [reportContent, setReportContent] = useState('');
  // chart data
  const [playerGameData, setPlayerGameData] = useState([]);
  const [statType, setStatType] = useState('points'); // default to points
  const [dateRange, setDateRange] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await IllinoisDataService.getAllIllinoisData();
        setPlayerData(data);
        
        // Find player if not already set
        if (!player && id) {
          const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
          if (foundPlayer) {
            setPlayer(foundPlayer);
          }
        }
      } catch (error) {
        console.error('Error fetching Illinois data:', error);
        const fallbackData = IllinoisDataService.getFallbackAllData();
        setPlayerData(fallbackData);
        
    if (!player && id) {
          const foundPlayer = fallbackData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      }
    }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player, id]);

  useEffect(() => {
    if (player && playerData) {
      const playerId = player.playerId;
      


      // scouting reports
      const reports = playerData.scoutingReports?.filter(r => r.playerId === playerId) || [];
      setScoutingReports(reports);
      
      // grab game logs for charts
      const gameLogs = playerData.game_logs?.filter(game => game.playerId === playerId) || [];
      const sortedGames = [...gameLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // convert raw data to something the chart can use
      const chartData = sortedGames.map(game => {
        const gameDate = new Date(game.date);
        return {
          date: gameDate.toLocaleDateString(),
          points: game.fgm * 2 + game.tpm + game.ftm, 
          rebounds: (game.oreb || 0) + (game.dreb || 0),
          assists: game.ast || 0,
          steals: game.stl || 0,
          blocks: game.blk || 0
        };
      });
      
      setPlayerGameData(chartData);
    }
  }, [player, playerData]);

  // filter game data by date
  const getFilteredData = () => {
    if (dateRange === 'all' || playerGameData.length === 0) {
      return playerGameData;
    }
    
    const postseasonStart = new Date('2025-03-15');
    
    if (dateRange === 'regular') {
      return playerGameData.filter(game => new Date(game.date) < postseasonStart);
    } else if (dateRange === 'postseason') {
      return playerGameData.filter(game => new Date(game.date) >= postseasonStart);
    } else if (dateRange === 'last10') {
      return playerGameData.slice(-10);
    }
    
    return playerGameData;
  };

  // not connected to any backend yet, so this just updates local state
  const handleReportSubmit = (e) => {
    e.preventDefault();
    
    // simple form validation
    if (scoutName.trim() === '' || reportContent.trim() === '') {
      alert('Fill out all fields please');
      return;
    }
    
    const newReport = {
      scout: scoutName,
      report: reportContent,
      date: new Date().toLocaleDateString()
    };
    
    // add to beginning of array so newest is on top
    setUserReports([newReport, ...userReports]);
    setScoutName('');
    setReportContent('');
  };
  
  if (loading) {
    return (
      <div className="player-not-found">
        <h2>Loading Player Data...</h2>
      </div>
    );
  }
  
  if (!player) {
    return (
      <div className="player-not-found">
        <h2>Player Not Found</h2>
        <button onClick={() => navigate('/scouting')}>
          Back to Scouting
        </button>
      </div>
    );
  }
  
  // helper function to format height 
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  

  
  // handles broken images
  const handleImageError = (e) => {
    e.target.src = '/placeholder-user.svg';
  };
  
  // get the right image src
  const getPlayerImageSrc = () => {
    return player.photoUrl || '/placeholder-user.svg';
  };
  
  return (
    <div className="player-details">
      <button className="back-button" onClick={() => navigate('/scouting')}>
        Back to Scouting
      </button>
      
      <div className="player-profile">
        <div className="player-header">
          <div className="player-title">
            <h1>{player.name}</h1>

          </div>
          <div className="player-image">
            <img 
              src={getPlayerImageSrc()} 
              alt={`${player.name} headshot`}
              onError={handleImageError}
            />
          </div>
        </div>
        
        <div className="player-info-grid">
          <div className="player-bio">
            <h2>Player Bio</h2>
            <p><strong>Team:</strong> {player.currentTeam}</p>
            <p><strong>Position:</strong> {player.position || 'N/A'}</p>
            <p><strong>Height:</strong> {formatHeight(player.height)}</p>
            <p><strong>Weight:</strong> {player.weight ? `${player.weight} lbs` : 'N/A'}</p>
            <p><strong>League:</strong> {player.league}</p>
            <p><strong>From:</strong> {player.homeTown}, {player.homeState || player.homeCountry}</p>
            <p><strong>High School:</strong> {player.highSchool || 'N/A'}</p>
            {player.year && <p><strong>Year:</strong> {player.year}</p>}
            

          </div>
          
          <div className="player-analysis">
            <h2>Player Analysis</h2>
            
            <div className="player-summary">
              <p>
                {player.name} is a {formatHeight(player.height)} {player.position || 'player'} currently with {player.currentTeam} in the {player.league}.
                {player.isRecruit && ' This high school recruit shows great potential for the Illinois basketball program.'}
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
                    <option value="regular">Regular Season</option>
                    <option value="postseason">Postseason</option>
                    <option value="last10">Last 10 Games</option>
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
                  View Illinois Fit and Performance Projection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scouting Reports Section */}
        <div className="reports-section">
          <h2>Scouting Reports</h2>
          
          <div className="user-reports">
            {scoutingReports.length > 0 || userReports.length > 0 ? (
              <div className="reports-list">
                {userReports.map((report, index) => (
                  <div key={`user-${index}`} className="report user-submitted-report">
                    <div className="report-header">
                      <h3>{report.scout} <span className="your-report">(Your Report)</span></h3>
                      <span className="report-date">{report.date}</span>
                    </div>
                    <p>{report.report}</p>
                  </div>
                ))}
                
                {scoutingReports.map((report, index) => (
                  <div key={`scout-${index}`} className="report">
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