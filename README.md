# NBA Draft Hub

A comprehensive draft analysis tool built for NBA front office decision-makers, featuring prospect rankings, detailed player profiles, stat visualizations, and AI-powered player projections.

## Features

- **Interactive Big Board**: View and filter draft prospects ranked by consensus scout ratings
- **Detailed Player Profiles**: Access in-depth statistics and measurements for each prospect
- **Custom Scouting Reports**: Create and save custom scouting reports for prospects
- **Data Visualization**: Compare players with interactive scatter plots and side-by-side comparisons
- **AI Player Projections**: Generate detailed future projections for prospects with customizable parameters
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Live Website

Visit the live application: [NBA Draft Hub](https://mavericksdrafthub.netlify.app)

## Technology Stack

- **Frontend**: React with Vite
- **UI Framework**: Material UI components
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router
- **Charts**: Recharts
- **API Integration**: AWS Lambda for secure API calls
- **Deployment**: Netlify


### Home
Introduction to the NBA Draft Hub with navigation to key features.

### Big Board
Interactive listing of draft prospects with:
- Search functionality
- Toggle between table and card views
- Quick access to detailed player profiles

### Player Details
Comprehensive player information including:
- Physical measurements
- Statistical performance
- Scouting report creation
- Access to AI-powered future projections

### Data Visualization
Interactive data exploration tools:
- Scatter plots comparing key metrics
- Player comparison tool for side-by-side analysis

### Player Projection
AI-powered projection tool with customizable parameters:
- Development timeline (1, 3, or 5 years)
- Projected role (starter, rotation, bench, specialist)
- Development focus areas


## Security Notes

For the AI-powered projection feature:
- API keys are securely stored in environment variables
- Requests are proxied through AWS Lambda to protect credentials
- No sensitive information is exposed to the client


