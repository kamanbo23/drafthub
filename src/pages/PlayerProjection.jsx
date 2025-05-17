import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import playerData from '../intern_project_data.json';
import './PlayerProjection.css';

// API key would be in env variables in production
const API_KEY = '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';

const PlayerProjection = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Player data
  const [player, setPlayer] = useState(location.state?.player);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(id || '');
  
  // Form stuff
  const [timeline, setTimeline] = useState('3');
  const [role, setRole] = useState('starter');
  const [focusAreas, setFocusAreas] = useState([]);
  
  // Projection state
  const [projection, setProjection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  
  // Areas player can focus on
  const focusOptions = [
    { id: 'shooting', label: 'Shooting' },
    { id: 'defense', label: 'Defense' },
    { id: 'playmaking', label: 'Playmaking' },
    { id: 'rebounding', label: 'Rebounding' },
    { id: 'postPlay', label: 'Post Play' }
  ];
  
  // Get player data on load
  useEffect(() => {
    setAllPlayers(playerData.bio || []);
    
    if (!player && id) {
      const foundPlayer = playerData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        setSelectedPlayerId(foundPlayer.playerId.toString());
      }
    }
  }, [player, id]);
  
  // Handle player selection
  const handlePlayerChange = (e) => {
    const newId = e.target.value;
    setSelectedPlayerId(newId);
    
    if (newId) {
      const selected = allPlayers.find(p => p.playerId.toString() === newId);
      setPlayer(selected);
    } else {
      setPlayer(null);
    }
  };
  
  // Toggle focus areas
  const toggleFocusArea = (areaId) => {
    if (focusAreas.includes(areaId)) {
      setFocusAreas(focusAreas.filter(id => id !== areaId));
    } else {
      setFocusAreas([...focusAreas, areaId]);
    }
  };
  
  // Convert height to feet/inches
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  
  // Main function to generate the projection
  const generateProjection = async () => {
    if (!player) {
      setError('Please select a player');
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Getting player data...');
    setError(null);
    
    try {
      // Get additional player data
      const measurements = playerData.measurements?.find(m => m.playerId === player.playerId);
      const rankings = playerData.scoutRankings?.find(r => r.playerId === player.playerId);
      
      setLoadingMessage('Building the report...');
      
      // Get consensus rank
      let consensusRank = null;
      if (rankings) {
        const validRanks = [
          rankings["ESPN Rank"],
          rankings["Sam Vecenie Rank"],
          rankings["Kevin O'Connor Rank"],
          rankings["Kyle Boone Rank"],
          rankings["Gary Parrish Rank"]
        ].filter(rank => rank !== null);
        
        if (validRanks.length > 0) {
          consensusRank = Math.round(validRanks.reduce((a, b) => a + b, 0) / validRanks.length);
        }
      }
      
      // Build player info for AI prompting
      const playerInfo = {
        name: player.name,
        height: formatHeight(player.height),
        weight: player.weight,
        position: player.position,
        team: player.currentTeam,
        wingspan: measurements?.wingspan ? formatHeight(measurements.wingspan) : 'N/A',
        reach: measurements?.reach ? formatHeight(measurements.reach) : 'N/A',
        rank: consensusRank
      };
      
      // Create prompt for DeepSeek Prover
      const prompt = `You are writing a professional scouting report for the Dallas Mavericks NBA team about ${playerInfo.name}.

Please create a structured report with the following sections:
1. Executive Summary
2. Physical Profile
3. Projected Development (${timeline}-year timeline)
4. Potential weaknesses
4. Fit with Mavericks
5. NBA Player Comparison
6. Conclusion

Key information about the player:
- Name: ${playerInfo.name}
- Current Team: ${playerInfo.team}
- Position: ${playerInfo.position || 'N/A'}
- Height: ${playerInfo.height}
- Weight: ${playerInfo.weight} lbs
- Wingspan: ${playerInfo.wingspan}
- Standing Reach: ${playerInfo.reach}
- Draft Consensus Rank: ${playerInfo.rank || 'N/A'}

The report should project the player as a potential ${role} with a ${timeline}-year development timeline.

Focus areas for development: ${focusAreas.length > 0 ? focusAreas.map(area => {
        const option = focusOptions.find(opt => opt.id === area);
        return option ? option.label.toLowerCase() : area;
      }).join(', ') : 'all-around game'}.

Mavericks context:
- Head Coach: Jason Kidd
- Core Players: Kyrie Irving, P.J. Washington, Dereck Lively II
- Team Needs: Outside shooting, secondary playmaking, rim protection

Please provide a professional, concise evaluation with clear section headings. Format the response with proper markdown for headings.`;
      
      setLoadingMessage(`Generating report... (will take 15-30 seconds)`);
      
      // Call the OpenRouter API with DeepSeek Prover V2
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'NBA Draft Hub'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-prover-v2:free',
          messages: [
            {
              role: 'system',
              content: 'You are a professional NBA scout who writes clear, structured scouting reports with markdown formatting. Your reports are concise, insightful, and use section headings.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices.length) {
        throw new Error('Invalid API response');
      }
      
      const content = data.choices[0].message.content;
      setProjection(content);
      setIsLoading(false);
      setLoadingMessage('');
      
    } catch (err) {
      console.error('Error:', err);
      let errorMessage = 'Something went wrong. Try again.';
      
      if (err.message.includes('429')) {
        errorMessage = 'Too many requests. Please try again in a minute.';
      } else if (err.message.includes('401')) {
        errorMessage = 'API key issue. Please contact the developer.';
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  // Format the report content for display
  const formatReport = (content) => {
    if (!content) return null;
    
    // Split into paragraphs and convert to JSX
    return content.split('\n').map((paragraph, index) => {
      // Headers (# Title)
      if (/^#{1,3}\s/.test(paragraph)) {
        const level = paragraph.match(/^(#{1,3})\s/)[1].length;
        const text = paragraph.replace(/^#{1,3}\s/, '');
        
        if (level === 1) {
          return <h2 key={index}>{text}</h2>;
        } else if (level === 2) {
          return <h3 key={index}>{text}</h3>;
        } else {
          return <h4 key={index}>{text}</h4>;
        }
      }
      
      // Bullet points
      if (/^[-*]\s/.test(paragraph)) {
        return <li key={index}>{paragraph.replace(/^[-*]\s/, '')}</li>;
      }
      
      // Numbered points
      if (/^\d+\.\s/.test(paragraph)) {
        return <li key={index}>{paragraph.replace(/^\d+\.\s/, '')}</li>;
      }
      
      // Regular paragraph 
      if (paragraph.trim() !== '') {
        return <p key={index}>{paragraph}</p>;
      }
      
      // Empty line
      return <br key={index} />;
    });
  };
  
  return (
    <div className="player-projection">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      
      <h1>Mavericks Player Projection</h1>
      
      <div className="projection-container">
        <div className="projection-form">
          <div className="form-group">
            <label htmlFor="player-select">Select Player:</label>
            <select
              id="player-select"
              value={selectedPlayerId}
              onChange={handlePlayerChange}
            >
              <option value="">-- Select a player --</option>
              {allPlayers.map(p => (
                <option key={p.playerId} value={p.playerId.toString()}>
                  {p.name} - {p.currentTeam}
                </option>
              ))}
            </select>
          </div>
          
          {player && (
            <>
              <div className="player-summary">
                <div className="player-info">
                  <h3>{player.name}</h3>
                  <p>{player.currentTeam} | {player.league}</p>
                </div>
                {player.photoUrl && (
                  <div className="player-photo">
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="timeline">Projection Timeline:</label>
                <select
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="1">1 Year</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Projected Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="starter">Starter</option>
                  <option value="rotation">Rotation Player</option>
                  <option value="bench">Bench Player</option>
                  <option value="specialist">Specialist</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Focus Areas:</label>
                <div className="focus-areas">
                  {focusOptions.map(area => (
                    <div key={area.id} className="focus-area-option">
                      <input
                        type="checkbox"
                        id={`focus-${area.id}`}
                        checked={focusAreas.includes(area.id)}
                        onChange={() => toggleFocusArea(area.id)}
                      />
                      <label htmlFor={`focus-${area.id}`}>{area.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                className="generate-button"
                onClick={generateProjection}
                disabled={isLoading}
              >
                {isLoading ? loadingMessage || 'Generating...' : 'Generate Projection'}
              </button>
            </>
          )}
          
          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>
        
        {projection && (
          <div className="projection-results">
            <h2>Scouting Projection</h2>
            <div className="projection-content">
              {formatReport(projection)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProjection; 