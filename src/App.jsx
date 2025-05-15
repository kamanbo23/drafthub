import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BigBoard from './pages/BigBoard';
import DataViz from './pages/DataViz';
import './App.css';

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
