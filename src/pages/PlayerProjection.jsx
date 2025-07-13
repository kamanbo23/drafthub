import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import IllinoisDataService from '../services/illinoisDataService';

// UI stuff
import { 
  FormControl, InputLabel, Select, MenuItem, Button, 
  FormGroup, FormControlLabel, Checkbox, 
  Typography, Box, Card, CardContent, 
  CircularProgress, Alert
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

// Illinois Basketball Player Projection Component
const PlayerProjection = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // state stuff
  const [player, setPlayer] = useState(location.state?.player);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(id || '');
  const [playerData, setPlayerData] = useState(null);
  
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
    const fetchData = async () => {
      try {
        const data = await IllinoisDataService.getAllIllinoisData();
        setPlayerData(data);
        setAllPlayers(data.bio || []);
    
    // if we got here with an ID but no player object, find the player
    if (!player && id) {
          const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
          if (foundPlayer) {
            setPlayer(foundPlayer);
            setSelectedPlayerId(foundPlayer.playerId.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching Illinois data:', error);
        const fallbackData = IllinoisDataService.getFallbackAllData();
        setPlayerData(fallbackData);
        setAllPlayers(fallbackData.bio || []);
        
        if (!player && id) {
          const foundPlayer = fallbackData.bio.find(p => p.playerId.toString() === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        setSelectedPlayerId(foundPlayer.playerId.toString());
      }
    }
      }
    };

    fetchData();
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
  
  // calls the AI API
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
      const measurements = playerData?.measurements?.find(m => m.playerId === player.playerId);
      const rankings = playerData?.scoutRankings?.find(r => r.playerId === player.playerId);
      
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
        rank: consensusRank,
        isRecruit: player.isRecruit || false
      };
      
      // our prompt for the API
      const prompt = `You are writing a professional scouting report for the Illinois Fighting Illini basketball program about ${playerInfo.name}.

Please create a structured report with the following sections:
1. Executive Summary
2. Physical Profile
3. Projected Development (${timePeriod}-year timeline)
4. Potential weaknesses
5. Fit with Illinois Basketball
6. NCAA Player Comparison
7. Conclusion

Key information about the player:
- Name: ${playerInfo.name}
- Current Team: ${playerInfo.team}
- Position: ${playerInfo.position || 'N/A'}
- Height: ${playerInfo.height}
- Weight: ${playerInfo.weight ? `${playerInfo.weight} lbs` : 'N/A'}
- Wingspan: ${playerInfo.wingspan}
- Standing Reach: ${playerInfo.reach}
- Recruiting Rank: ${playerInfo.rank || 'N/A'}
- Type: ${playerInfo.isRecruit ? 'High School Recruit' : 'Current Player'}

The report should project the player as a potential ${playerRole} with a ${timePeriod}-year development timeline.

Focus areas for development: ${focusAreas.length > 0 ? focusAreas.map(area => {
        const option = FOCUS_AREAS.find(opt => opt.id === area);
        return option ? option.label.toLowerCase() : area;
      }).join(', ') : 'all-around game'}.

Illinois Basketball context:
- Head Coach: Brad Underwood
- Conference: Big Ten
- Recent Success: Elite 8 appearance in 2024-25 season
- Style: Fast-paced, defensive-minded, three-point shooting
- Key Players: Terrence Shannon Jr., Marcus Domask, Coleman Hawkins

Please provide a professional, concise evaluation with clear section headings. Format the response with proper markdown for headings.`;
      
      setLoadingMsg(`Generating your report (takes ~15-20 secs)`);
      
      // Use OpenRouter API directly with a working free model
      // Note: Lambda endpoint has an outdated model, so we'll use direct API call
      if (API_KEY) {
        setLoadingMsg('Generating projection with AI...');
        
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Illinois Basketball Scout'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3-14b:free',
            messages: [
              {
                role: 'system',
                content: 'You are a professional college basketball scout who writes clear, structured scouting reports with markdown formatting. Your reports are concise, insightful, and use section headings.'
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
        
        if (!openRouterResponse.ok) {
          throw new Error(`OpenRouter error: ${openRouterResponse.status}`);
        }
        
        const openRouterResult = await openRouterResponse.json();
        setProjectionText(openRouterResult.choices[0].message.content);
      } else {
        throw new Error('No API key available - please add VITE_OPENROUTERKEY to your .env file');
      }
      
    } catch (error) {
      console.error('Projection generation failed:', error);
      setErrorMsg(`Failed to generate projection: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };
  
  // format the markdown response
  const formatReport = (content) => {
    if (!content) return null;
    
    // Simple markdown to HTML conversion
    const formatted = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Illinois Basketball Player Projection
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left side - Controls */}
        <Card sx={{ flex: { lg: '0 0 400px' }, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Projection Settings
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Player Selection */}
            <FormControl fullWidth>
              <InputLabel>Select Player</InputLabel>
            <Select
              value={selectedPlayerId}
                label="Select Player"
              onChange={handlePlayerChange}
            >
                <MenuItem value="">
                  <em>Choose a player...</em>
                </MenuItem>
                {allPlayers.map((p) => (
                <MenuItem key={p.playerId} value={p.playerId.toString()}>
                    {p.name} ({p.currentTeam})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
            {/* Time Period */}
            <FormControl fullWidth>
              <InputLabel>Development Timeline</InputLabel>
                <Select
                  value={timePeriod}
                label="Development Timeline"
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <MenuItem value="1">1 Year</MenuItem>
                <MenuItem value="2">2 Years</MenuItem>
                  <MenuItem value="3">3 Years</MenuItem>
                <MenuItem value="4">4 Years</MenuItem>
                </Select>
              </FormControl>
              
            {/* Player Role */}
            <FormControl fullWidth>
              <InputLabel>Projected Role</InputLabel>
                <Select
                  value={playerRole}
                label="Projected Role"
                  onChange={(e) => setPlayerRole(e.target.value)}
                >
                <MenuItem value="bench">Bench Player</MenuItem>
                <MenuItem value="rotation">Rotation Player</MenuItem>
                  <MenuItem value="starter">Starter</MenuItem>
                <MenuItem value="star">Star Player</MenuItem>
                </Select>
              </FormControl>
              
            {/* Focus Areas */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Development Focus Areas
              </Typography>
              <FormGroup>
                {FOCUS_AREAS.map((area) => (
                  <FormControlLabel
                    key={area.id}
                    control={
                      <Checkbox 
                        checked={focusAreas.includes(area.id)} 
                        onChange={() => toggleFocusArea(area.id)}
                      />
                    }
                    label={area.label}
                  />
                ))}
              </FormGroup>
            </Box>
              
            {/* Generate Button */}
              <Button
                variant="contained"
                onClick={generateProjection}
              disabled={loading || !player}
              sx={{ mt: 2 }}
            >
              {loading ? 'Generating...' : 'Generate Projection'}
            </Button>
            
            {loading && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {loadingMsg}
                </Typography>
                  </Box>
          )}
          
          {errorMsg && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMsg}
              </Alert>
          )}
        </Box>
        </Card>
        
        {/* Right side - Results */}
        <Card sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Projection Report
          </Typography>
        
        {projectionText ? (
          <Box sx={{ 
              maxHeight: '600px', 
              overflowY: 'auto',
              '& h1, & h2, & h3': { 
                color: 'primary.main',
                mt: 2,
                mb: 1
              },
              '& strong': {
                fontWeight: 'bold'
              },
              '& em': {
                fontStyle: 'italic'
              }
            }}>
              {formatReport(projectionText)}
          </Box>
        ) : (
            <Typography variant="body2" color="text.secondary">
              Select a player and generate a projection to see the report here.
            </Typography>
        )}
        </Card>
      </Box>
    </Box>
  );
};

export default PlayerProjection; 