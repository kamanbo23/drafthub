import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import playerData from '../intern_project_data.json';

// MUI Components
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert 
} from '@mui/material';

// move to .env later
const API_KEY = import.meta.env.VITE_OPENROUTERKEY;

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
- Core Players: Kyrie Irving, Athony Davis,P.J. Washington, Dereck Lively II

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
  
  const formatReport = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((paragraph, index) => {
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
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Typography
        variant="h3"
        component="h1"
        align="center"
        color="primary"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        Player Projection AI
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: '30px' 
      }}>
        <Box sx={{ 
          backgroundColor: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
        }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="player-select-label">Select Player</InputLabel>
            <Select
              labelId="player-select-label"
              id="player-select"
              value={selectedPlayerId}
              onChange={handlePlayerChange}
              label="Select Player"
            >
              <MenuItem value="">-- Select a player --</MenuItem>
              {allPlayers.map(p => (
                <MenuItem key={p.playerId} value={p.playerId.toString()}>
                  {p.name} - {p.currentTeam}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {player && (
            <>
              <Card sx={{ mb: 2 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {player.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {player.currentTeam} | {player.league}
                    </Typography>
                  </Box>
                  {player.photoUrl && (
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden' }}>
                      <img 
                        src={player.photoUrl} 
                        alt={player.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="timeline-label">Projection Timeline</InputLabel>
                <Select
                  labelId="timeline-label"
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  label="Projection Timeline"
                >
                  <MenuItem value="1">1 Year</MenuItem>
                  <MenuItem value="3">3 Years</MenuItem>
                  <MenuItem value="5">5 Years</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="role-label">Projected Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Projected Role"
                >
                  <MenuItem value="starter">Starter</MenuItem>
                  <MenuItem value="rotation">Rotation Player</MenuItem>
                  <MenuItem value="bench">Bench Player</MenuItem>
                  <MenuItem value="specialist">Specialist</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Focus Areas:</Typography>
              <FormGroup sx={{ mb: 2 }}>
                {FOCUS_AREAS.map(area => (
                  <FormControlLabel
                    key={area.id}
                    control={
                      <Checkbox 
                        checked={focusAreas.includes(area.id)} 
                        onChange={() => toggleFocusArea(area.id)}
                        name={area.id} 
                      />
                    }
                    label={area.label}
                  />
                ))}
              </FormGroup>
              
              <Button
                variant="contained"
                color="primary"
                onClick={generateProjection}
                disabled={isLoading}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {isLoading ? 
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                    {loadingMessage || 'Generating...'}
                  </Box> 
                  : 'Generate Projection'
                }
              </Button>
            </>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}
        </Box>
        
        {projection && (
          <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            padding: '25px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
          }}>
            <Typography variant="h5" color="primary" sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1, mb: 2 }}>
              Scouting Projection
            </Typography>
            <Box sx={{ whiteSpace: 'pre-line' }}>
              {formatReport(projection)}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlayerProjection; 