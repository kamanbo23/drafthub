import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import playerData from '../intern_project_data.json';

// UI stuff
import { 
  FormControl, InputLabel, Select, MenuItem, Button, 
  FormGroup, FormControlLabel, Checkbox, 
  Typography, Box, Card, CardContent, 
  CircularProgress, Alert  // might add Snackbar later
} from '@mui/material';

// Todo: move this to env file 
const API_KEY = import.meta.env.VITE_OPENROUTERKEY;

// these are the areas a player could improve in
const FOCUS_AREAS = [
  { id: 'shooting', label: 'Shooting' },
  { id: 'defense', label: 'Defense' },  
  { id: 'playmaking', label: 'Playmaking' },
  { id: 'rebounding', label: 'Rebounding' },
  { id: 'postPlay', label: 'Post Play' }  
];

// The main projection component
const PlayerProjection = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // state stuff
  const [player, setPlayer] = useState(location.state?.player);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(id || '');
  
  // projection options
  const [timePeriod, setTimePeriod] = useState('3'); // 3 years is a good default
  const [playerRole, setPlayerRole] = useState('starter');
  const [focusAreas, setFocusAreas] = useState([]);
  
  // UI states
  const [projectionText, setProjectionText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // get all players when component loads
  useEffect(() => {
    // set all players from our dataset
    setAllPlayers(playerData.bio || []);
    
    // if we got here with an ID but no player object, find the player
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
  
  // this is where the magic happens - calls the AI API
  const generateProjection = async () => {
    if (!player) {
      setErrorMsg('Please select a player first');
      return;
    }
    
    setLoading(true);
    setLoadingMsg('Getting player data...');
    setErrorMsg(null);
    
    try {
      // grab some extra player data
      const measurements = playerData.measurements?.find(m => m.playerId === player.playerId);
      const rankings = playerData.scoutRankings?.find(r => r.playerId === player.playerId);
      
      setLoadingMsg('Building report...');
      
      // calculate consensus rank if we have any
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
      
      // all the info we have about the player
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
      
      // our prompt for the API
      const prompt = `You are writing a professional scouting report for the Dallas Mavericks NBA team about ${playerInfo.name}.

Please create a structured report with the following sections:
1. Executive Summary
2. Physical Profile
3. Projected Development (${timePeriod}-year timeline)
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

The report should project the player as a potential ${playerRole} with a ${timePeriod}-year development timeline.

Focus areas for development: ${focusAreas.length > 0 ? focusAreas.map(area => {
        const option = FOCUS_AREAS.find(opt => opt.id === area);
        return option ? option.label.toLowerCase() : area;
      }).join(', ') : 'all-around game'}.

Mavericks context:
- Head Coach: Jason Kidd
- Core Players: Kyrie Irving, Athony Davis,P.J. Washington, Dereck Lively II

Please provide a professional, concise evaluation with clear section headings. Format the response with proper markdown for headings.`;
      
      setLoadingMsg(`Generating your report (takes ~15-20 secs)`);
      
      // Call our Lambda function API endpoint
      const lambdaEndpoint = import.meta.env.VITE_LAMBDA_API_ENDPOINT;
      
      const apiResponse = await fetch(lambdaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          systemMessage: 'You are a professional NBA scout who writes clear, structured scouting reports with markdown formatting. Your reports are concise, insightful, and use section headings.',
          temperature: 0.7,
          maxTokens: 2000
        })
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(`API error: ${apiResponse.status} – ${errorData.detail || errorData.error || apiResponse.statusText}`);
      }
      
      const data = await apiResponse.json();
      const content = data.choices[0].message.content;
      setProjectionText(content);
      setLoading(false);
      setLoadingMsg('');
      
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
      setLoadingMsg('');
    }
  };
  
  // format the markdown text into react components
  const formatReport = (content) => {
    if (!content) return null;
    
    // split by newlines and convert to appropriate JSX
    const elements = [];
    const lines = content.split('\n');
    
    // loop through all lines
    for (let i = 0; i < lines.length; i++) {
      const paragraph = lines[i];
      const idx = i; // keep track for React keys
      
      // headings - h1, h2, h3
      if (paragraph.startsWith('# ')) {
        elements.push(<h2 key={idx}>{paragraph.substring(2)}</h2>);
        continue;
      } else if (paragraph.startsWith('## ')) {
        elements.push(<h3 key={idx}>{paragraph.substring(3)}</h3>);
        continue;
      } else if (paragraph.startsWith('### ')) {
        elements.push(<h4 key={idx}>{paragraph.substring(4)}</h4>);
        continue;
      }
      
      // bullet points
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        elements.push(<li key={idx}>{paragraph.substring(2)}</li>);
        continue;
      }
      
      // numbered list items
      if (/^\d+\.\s/.test(paragraph)) {
        // This regex matches stuff like "1. Item"
        elements.push(<li key={idx}>{paragraph.replace(/^\d+\.\s/, '')}</li>);
        continue;
      }
      
      // regular paragraphs (if not empty)
      if (paragraph.trim().length > 0) {
        elements.push(<p key={idx}>{paragraph}</p>);
      } else {
        // empty line
        elements.push(<br key={idx} />);
      }
    }
    
    return elements;
  };
  
  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f7fa'
    }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/big-board')}
        sx={{ mb: 2 }}
      >
        ← Back to Big Board
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
        Player Future Projection
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, 
        gap: '20px' 
      }}>
        <Box sx={{ 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          height: 'fit-content'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              pb: 1, 
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600
            }}
          >
            Settings
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="player-select-label">Select Player</InputLabel>
            <Select
              labelId="player-select-label"
              id="player-select"
              value={selectedPlayerId}
              onChange={handlePlayerChange}
              label="Select Player"
            >
              <MenuItem value="">-- Choose a player --</MenuItem>
              {allPlayers.map(p => (
                <MenuItem key={p.playerId} value={p.playerId.toString()}>
                  {p.name} - {p.currentTeam || 'N/A'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {player && (
            <>
              <Card 
                sx={{ 
                  mb: 3, 
                  borderRadius: '8px',
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2
                }}>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {player.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {player.currentTeam || 'N/A'} {player.position ? `| ${player.position}` : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {player.height ? `${formatHeight(player.height)}` : ''} 
                      {player.weight ? ` • ${player.weight} lbs` : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0'
                  }}>
                    <img 
                      src={player.photoUrl || '/placeholder-user.svg'} 
                      alt={`${player.name}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-user.svg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                </CardContent>
              </Card>
              
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Options:</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="timeline-label">Timeline</InputLabel>
                <Select
                  labelId="timeline-label"
                  id="timeline"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  label="Timeline"
                >
                  <MenuItem value="1">1 Year</MenuItem>
                  <MenuItem value="3">3 Years</MenuItem>
                  <MenuItem value="5">5 Years</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="role-label">Projected Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={playerRole}
                  onChange={(e) => setPlayerRole(e.target.value)}
                  label="Projected Role"
                >
                  <MenuItem value="starter">Starter</MenuItem>
                  <MenuItem value="rotation">Rotation Player</MenuItem>
                  <MenuItem value="bench">Bench Player</MenuItem>
                  <MenuItem value="specialist">Specialist</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Development Focus:</Typography>
              <FormGroup sx={{ mb: 3 }}>
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
                disabled={loading}
                fullWidth
                sx={{ 
                  py: 1.5, 
                  fontWeight: 600
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                    <span>{loadingMsg || 'Loading...'}</span>
                  </Box>
                ) : 'Generate Projection'}
              </Button>
            </>
          )}
          
          {errorMsg && (
            <Alert severity="error" sx={{ mt: 3 }}>{errorMsg}</Alert>
          )}
        </Box>
        
        {projectionText ? (
          <Box sx={{ 
            bgcolor: 'white', 
            p: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            maxHeight: { md: '85vh' },
            overflow: { md: 'auto' }
          }}>
            <Typography 
              variant="h5" 
              color="primary" 
              sx={{ 
                borderBottom: '1px solid #e0e0e0', 
                pb: 1, 
                mb: 3,
                fontWeight: 600
              }}
            >
              Scouting Report: {player?.name}
            </Typography>
            <Box className="report-content" sx={{ 
              '& h2': {
                color: '#333',
                fontSize: '1.5rem',
                mt: 3,
                mb: 2,
                fontWeight: 700,
              },
              '& h3': {
                color: '#2565c0', // hardcoded color instead of theme
                fontSize: '1.25rem',
                mt: 2,
                mb: 1,
                fontWeight: 600
              },
              '& h4': {
                fontSize: '1.1rem',
                mt: 2,
                mb: 1,
                fontWeight: 600
              },
              '& p': {
                lineHeight: 1.6,
                mb: 1.5 // inconsistent with h3/h4
              },
              '& li': {
                mb: 0.75, // inconsistent with other spacing
                ml: 2
              }
            }}>
              {formatReport(projectionText)}
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            background: '#fff', // different syntax than above
            padding: '30px', 
            borderRadius: '10px', // inconsistent with other panels
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <img 
              src="/placeholder-user.svg" 
              alt="Select player" 
              style={{ 
                width: '100px', 
                height: '100px',
                opacity: 0.4,
                marginBottom: '20px'
              }} 
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Select a player and create a projection
            </Typography>
            <Typography color="text.secondary">
              This tool will analyze the player and generate a detailed scouting report.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlayerProjection; 