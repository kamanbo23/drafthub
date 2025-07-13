import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const colors = {
  points: '#e84a27',
  assists: '#13294b',
  rebounds: '#27ae60'
};

const renderBarChart = (data, dataKey, title, color) => (
  <Card elevation={3} sx={{ p: 2 }}>
    <CardContent>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip formatter={(val) => val.toFixed(1)} />
          <Bar dataKey={dataKey} fill={color} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

function HighSchoolLeaders() {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState([]);
  const [assists, setAssists] = useState([]);
  const [rebounds, setRebounds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await fetch('http://localhost:3002/api/hs-leaders');
        const json = await resp.json();
        // Take top 15 for each category
        setPoints(json.pointsLeaders.slice(0, 15).map(p => ({ name: p.name.split(' ').slice(-1).join(' '), points: p.points })));
        setAssists(json.assistsLeaders.slice(0, 15).map(p => ({ name: p.name.split(' ').slice(-1).join(' '), assists: p.assists })));
        setRebounds(json.reboundsLeaders.slice(0, 15).map(p => ({ name: p.name.split(' ').slice(-1).join(' '), rebounds: p.rebounds })));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load HS leaders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#e84a27' }}>
          National High School Basketball Leaders (2024-25)
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Live stat leaders pulled from MaxPreps – Points, Assists & Rebounds per game
        </Typography>
      </Paper>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {renderBarChart(points, 'points', 'Top Scorers – PPG', colors.points)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderBarChart(assists, 'assists', 'Top Playmakers – APG', colors.assists)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderBarChart(rebounds, 'rebounds', 'Top Rebounders – RPG', colors.rebounds)}
        </Grid>
      </Grid>
    </Container>
  );
}

export default HighSchoolLeaders; 