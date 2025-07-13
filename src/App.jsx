import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import DataViz from './pages/DataViz';
import HighSchoolLeaders from './pages/HighSchoolLeaders';
import PlayerDetails from './pages/PlayerDetails';
import PlayerProjection from './pages/PlayerProjection';
import ScoutingBoard from './pages/ScoutingBoard';
import PlayerComparison from './pages/PlayerComparison';
import LineupBuilder from './pages/LineupBuilder';
import TeamAnalytics from './pages/TeamAnalytics';
import './App.css';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Navbar />
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/scouting" element={<ScoutingBoard />} />
            <Route path="/comparison" element={<PlayerComparison />} />
            <Route path="/lineup-builder" element={<LineupBuilder />} />
            <Route path="/team-analytics" element={<TeamAnalytics />} />
            <Route path="/data-viz" element={<DataViz />} />
            <Route path="/hs-leaders" element={<HighSchoolLeaders />} />
            <Route path="/player/:id" element={<PlayerDetails />} />
            <Route path="/player/:id/projection" element={<PlayerProjection />} />
            <Route path="/projection" element={<PlayerProjection />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
