import React from 'react';

function Home() {
  return (
    <div className="home">
      <div className="welcome-section">
        <h2>Welcome to the Mavericks Draft Hub</h2>
        <p>Your  tool for evaluating NBA Draft prospects</p>
      </div>
      <div className="Features">
        <h3>Features</h3>
        <ul className="feature-list">
          <li>Big Board</li>
            <p>View the latest NBA Draft prospects and their stats, you are able to filter by position, team, and more. Get deeper insights and log in notes about the prospects as well as a Mavericks fit option where you set speciic traits that the mavericks are looking for and it will show you prospects that match those traits.</p>
          
          <li>Data Visualization</li>
          <p>See how prospects stack up against each other in a variety of categories. See generated charts based on your specifications and see how prospects rank.</p>

        </ul>
      </div>
    </div>
  );
}

export default Home; 