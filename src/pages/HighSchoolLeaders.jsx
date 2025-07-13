import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Alert,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

const colors = {
  scoring: {
    primary: '#FF6B35',
    secondary: '#FFE5DC',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
  },
  assists: {
    primary: '#4ECDC4', 
    secondary: '#E8F8F7',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
  },
  rebounds: {
    primary: '#45B7D1',
    secondary: '#E3F2FD',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)'
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper 
        elevation={8} 
        sx={{ 
          p: 2, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          {data.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
          {data.school}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            size="small" 
            label={`${data.statValue} ${payload[0].name}`}
            sx={{ 
              background: payload[0].color,
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Typography variant="caption">
            #{data.rank} nationally
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

const renderBarChart = (data, title, colorScheme, icon) => (
  <Card 
    elevation={6} 
    sx={{ 
      mb: 3,
      background: `linear-gradient(135deg, ${colorScheme.secondary} 0%, #ffffff 100%)`,
      borderRadius: 3,
      overflow: 'hidden',
      border: `2px solid ${colorScheme.primary}20`
    }}
  >
    <Box 
      sx={{ 
        background: colorScheme.gradient,
        p: 2,
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
    </Box>
    <CardContent sx={{ p: 3 }}>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data.slice(0, 12)} 
          layout="vertical" 
          margin={{ left: 120, right: 30, top: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={`${colorScheme.primary}30`} />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={110}
            tick={{ fontSize: 11, fill: '#555' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="statValue" 
            fill={colorScheme.primary}
            radius={[0, 8, 8, 0]}
            stroke={colorScheme.primary}
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value, player, colorScheme, icon, rank }) => (
  <Card 
    elevation={4}
    sx={{ 
      background: colorScheme.gradient,
      color: 'white',
      textAlign: 'center',
      height: '100%',
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box 
      sx={{ 
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {icon}
    </Box>
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value || 'N/A'}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
        {title}
      </Typography>
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: 2, 
        p: 1,
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {player || 'No data'}
        </Typography>
        {rank && (
          <Chip 
            size="small" 
            label={`#${rank} National`}
            sx={{ 
              mt: 1,
              background: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

const HighSchoolLeaders = () => {
  const [leadersData, setLeadersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/hs-leaders');
        const result = await response.json();
        
        if (result.success) {
          setLeadersData(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch leaders');
        }
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress size={80} sx={{ color: colors.scoring.primary }} />
        <Typography variant="h5" sx={{ mt: 3, color: '#666' }}>
          Loading National High School Leaders...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!leadersData) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          No leaders data available
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                background: colors.scoring.gradient,
                fontSize: '2rem'
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: '2.5rem' }} />
            </Avatar>
          </Box>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF6B35, #4ECDC4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            National High School Basketball Leaders
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: 600, mx: 'auto' }}>
            Live statistical leaders from MaxPreps featuring the nation's top high school basketball performers
          </Typography>
        </Box>

        {/* Summary Stats */}
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            mb: 6, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
            Statistical Leaders
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Points Per Game"
                value={leadersData.scoring?.[0]?.statValue}
                player={leadersData.scoring?.[0]?.name}
                colorScheme={colors.scoring}
                icon={<SportsBasketballIcon sx={{ fontSize: '2rem' }} />}
                rank={1}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StatCard
                title="Assists Per Game"
                value={leadersData.assists?.[0]?.statValue}
                player={leadersData.assists?.[0]?.name}
                colorScheme={colors.assists}
                icon={<TrendingUpIcon sx={{ fontSize: '2rem' }} />}
                rank={1}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StatCard
                title="Rebounds Per Game"
                value={leadersData.rebounds?.[0]?.statValue}
                player={leadersData.rebounds?.[0]?.name}
                colorScheme={colors.rebounds}
                icon={<SchoolIcon sx={{ fontSize: '2rem' }} />}
                rank={1}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Detailed Charts */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={4}>
            {renderBarChart(
              leadersData.scoring || [], 
              'Top Scoring Leaders (PPG)', 
              colors.scoring,
              <SportsBasketballIcon />
            )}
          </Grid>
          
          <Grid item xs={12} lg={4}>
            {renderBarChart(
              leadersData.assists || [], 
              'Top Assists Leaders (APG)', 
              colors.assists,
              <TrendingUpIcon />
            )}
          </Grid>
          
          <Grid item xs={12} lg={4}>
            {renderBarChart(
              leadersData.rebounds || [], 
              'Top Rebounds Leaders (RPG)', 
              colors.rebounds,
              <SchoolIcon />
            )}
          </Grid>
        </Grid>

        {/* Footer Info */}
        <Paper 
          elevation={4}
          sx={{ 
            p: 3, 
            mt: 6, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ color: '#666' }}>
            Data sourced from MaxPreps • Updated in real-time • Featuring top 50 leaders in each category
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HighSchoolLeaders; 