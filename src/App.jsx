import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BigBoard from './pages/BigBoard';
import DataViz from './pages/DataViz';
import PlayerDetails from './pages/PlayerDetails';
import PlayerProjection from './pages/PlayerProjection';
import './App.css';

// handles routing
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/big-board" element={<BigBoard />} />
            <Route path="/data-viz" element={<DataViz />} />
            <Route path="/player/:id" element={<PlayerDetails />} />
            <Route path="/player/:id/projection" element={<PlayerProjection />} />
            <Route path="/projection" element={<PlayerProjection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
