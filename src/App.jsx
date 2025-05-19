import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BigBoard from './pages/BigBoard';
import DataViz from './pages/DataViz';
import PlayerDetails from './pages/PlayerDetails';
import PlayerProjection from './pages/PlayerProjection';
import FaceOff from './pages/FaceOff';
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
            <Route path="/big-board" element={<BigBoard />} />
            <Route path="/data-viz" element={<DataViz />} />
            <Route path="/data-viz/face-off" element={<FaceOff />} />
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
