import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import playerData from '../intern_project_data.json';
import './PlayerProjection.css';

// TODO: move to .env later
const API_KEY = import.meta.env.OPENROUTERKEY;

// might need to add more later
const FOCUS_AREAS = [
  { id: 'shooting', label: 'Shooting' },
  { id: 'defense', label: 'Defense' },
  { id: 'playmaking', label: 'Playmaking' },
  { id: 'rebounding', label: 'Rebounding' },
  { id: 'postPlay', label: 'Post Play' }
];

const PlayerProjection = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // player state
  const [player, setPlayer] = useState(location.state?.player);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(id || '');
  
  // projection settings
  const [timeline, setTimeline] = useState('3'); // Default to 3 years
  const [role, setRole] = useState('starter');
  const [focusAreas, setFocusAreas] = useState([]);
  
  // UI state
  const [projection, setProjection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  // load players on mount
  useEffect(() => {
    setAllPlayers(playerData.bio || []);
    
    // if we have an ID but no player, try to find them
    if (!player && id) {
      const foundPlayer = playerData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        setSelectedPlayerId(foundPlayer.playerId.toString());
      }
    }
  }, [player, id]);
  
  // handle player selection change
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
  
  // toggle focus areas for development
  const toggleFocusArea = (areaId) => {
    setFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };
  
  // convert inches to feet and inches format
  const formatHeight = (inches) => {
    if (!inches) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  
  // generate the scouting report
  const generateProjection = async () => {
    if (!player) {
      setError('Please select a player');
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Getting player data...');
    setError(null);
    
    try {
      // Get player measurements and rankings
      const measurements = playerData.measurements?.find(m => m.playerId === player.playerId);
      const rankings = playerData.scoutRankings?.find(r => r.playerId === player.playerId);
      
      setLoadingMessage('Building the report...');
      
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
      
      // build player info object
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
      
      // prompt
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
        const option = FOCUS_AREAS.find(opt => opt.id === area);
        return option ? option.label.toLowerCase() : area;
      }).join(', ') : 'all-around game'}.

Mavericks context:
- Head Coach: Jason Kidd
- Core Players: Kyrie Irving, P.J. Washington, Dereck Lively II
- Team Needs: Outside shooting, secondary playmaking, rim protection

Please provide a professional, concise evaluation with clear section headings. Format the response with proper markdown for headings.`;
      
      setLoadingMessage(`Generating report (will take 20 seconds)`);
      
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
        throw new Error('API error: ' + response.status);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      setProjection(content);
      setIsLoading(false);
      setLoadingMessage('');
      
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Try again.');
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  // Format the markdown report into React components
  const formatReport = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((paragraph, index) => {
      // Handle headers
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
      
      // Handle bullet points
      if (/^[-*]\s/.test(paragraph)) {
        return <li key={index}>{paragraph.replace(/^[-*]\s/, '')}</li>;
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        return <li key={index}>{paragraph.replace(/^\d+\.\s/, '')}</li>;
      }
      
      // Handle regular paragraphs
      if (paragraph.trim() !== '') {
        return <p key={index}>{paragraph}</p>;
      }
      
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
                  {FOCUS_AREAS.map(area => (
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