import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">NBA Draft Hub</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/big-board" className="nav-link">Big Board</Link>
        <Link to="/data-visualization" className="nav-link">Data Visualization</Link>
        <Link to="/projection" className="nav-link">Player Projections</Link>
      </div>
    </nav>
  );
}

export default Navbar;