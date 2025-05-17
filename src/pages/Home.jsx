import React from 'react';
import styles from './Home.module.css';

// home page - pretty basic for now
function Home() {
  // for debugging
  console.log('Styles object:', styles);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <img 
          src="/Mavericks-logo.png" 
          alt="Mavericks Logo" 
          className={styles.logo}
          style={{ maxWidth: '200px' }}
        />
        <h2 className={styles.title}>Welcome to the Mavericks Draft Hub</h2>
        <p className={styles.subtitle}>Your tool for evaluating NBA Draft prospects</p>
      </div>
      
      <div className={styles.features}>
        <h3 className={styles.featuresTitle}>Features</h3>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h4 className={styles.featureName}>Big Board</h4>
            <p className={styles.featureDescription}>
              View the latest NBA Draft prospects and their stats, you are able to filter by position, team, and more. Get deeper insights and log in notes about the prospects as well as a Mavericks fit option where you set specific traits that the mavericks are looking for and it will show you prospects that match those traits.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <h4 className={styles.featureName}>Data Visualization</h4>
            <p className={styles.featureDescription}>
              See how prospects stack up against each other in a variety of categories. See generated charts based on your specifications and see how prospects rank.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h4 className={styles.featureName}>Player Projections AI</h4>
            <p className={styles.featureDescription}>
              Consult with a vetted AI model to get insights on prospect projection with historical data and reasoning. Modify your search with time, position, and skillset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 