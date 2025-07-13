# Illinois Men's Basketball Analytics Platform

A comprehensive full-stack analytics platform specifically designed for the Illinois Men's Basketball Analytics team, featuring advanced player evaluation, scouting tools, lineup building, and team performance analysis.

## 🏀 Platform Overview

This platform provides a complete suite of analytics tools for basketball evaluation and decision-making:

- **Player Scouting & Evaluation**: Advanced scouting interface with category-based analysis
- **Lineup Building**: Interactive lineup construction with chemistry analysis
- **Player Comparison**: Side-by-side analysis of up to 4 players with advanced visualizations
- **Team Analytics**: Comprehensive team performance analysis with KenPom integration
- **Recruiting Intelligence**: 247Sports and MaxPreps integration for prospect tracking
- **Data Visualization**: Interactive charts with category switching and responsive design

## 🛠 Technology Stack

### Frontend
- **React.js 19** with modern hooks and functional components
- **Material-UI (MUI) 7** for consistent, professional UI components
- **Recharts 2.15** for advanced data visualizations
- **React Router 7** for client-side routing
- **Vite 5** for fast development and optimized builds

### Backend
- **Node.js** with Express.js framework
- **Axios + Cheerio** for web scraping and data integration
- **CORS** enabled for cross-origin requests

### Data Sources
- **BartTorvik**: Illinois roster and college basketball statistics
- **KenPom**: Advanced team efficiency metrics and rankings
- **247Sports**: Recruiting rankings and prospect evaluations
- **MaxPreps**: High school statistical leaders and performance data

## 🚀 Features

### 1. Big Board
- Comprehensive player rankings with current Illinois roster
- High school recruits organized by statistical categories
- Sortable tables with advanced filtering options
- Toggle between table and card views

### 2. Scouting Board
- Category-based analysis (Offense, Defense, Efficiency, Physical)
- College vs High School player toggle
- Advanced search and filtering capabilities
- Interactive radar charts for player profiles
- Multi-player selection for comparison

### 3. Player Comparison
- Side-by-side analysis of up to 4 players
- Multiple visualization options (Radar, Bar Charts, Tables)
- Category-specific metric comparisons
- Detailed player profile cards

### 4. Lineup Builder
- Interactive lineup construction with drag-and-drop
- Team chemistry analysis and ratings
- Position balance evaluation
- Lineup saving and loading functionality
- Performance projections

### 5. Team Analytics
- KenPom integration for advanced metrics
- Performance trend analysis
- Big Ten conference comparisons
- Advanced statistics dashboard
- Player contribution analysis

### 6. Data Visualization
- Interactive scatter plots with zoom and pan
- Category switching for different analytical perspectives
- Top performers analysis
- Position distribution analysis
- Responsive chart design

## 📊 Analytics Categories

### Offensive Metrics
- Points Per Game
- Assists Per Game
- Field Goal Percentage
- Three-Point Percentage
- Free Throw Percentage
- Minutes Per Game

### Defensive Metrics
- Steals Per Game
- Blocks Per Game
- Rebounds Per Game
- Defensive Rating
- Physical Measurements

### Efficiency Metrics
- Shooting Percentages
- Assist-to-Turnover Ratio
- Player Efficiency Rating
- Usage Rate

### Physical Attributes
- Height and Weight
- Wingspan and Reach
- Vertical Measurements
- Body Composition

## 🎯 Key Capabilities

### Data Integration
- Real-time data scraping from multiple sources
- Comprehensive fallback data systems
- Error handling and data validation
- API-based architecture for scalability

### User Experience
- Responsive design for desktop and mobile
- Illinois-themed UI with official colors
- Intuitive navigation and search
- Interactive visualizations

### Analytics Features
- Advanced statistical analysis
- Player comparison tools
- Team performance tracking
- Recruiting intelligence
- Lineup optimization

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd illinois-basketball-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run start:backend
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3002`

### Alternative: Start both servers simultaneously
```bash
npm run start:full
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Main navigation
│   ├── PlayerCard.jsx  # Player display cards
│   ├── ScatterPlotChart.jsx  # Chart components
│   └── ui/             # Material-UI components
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── BigBoard.jsx    # Player rankings
│   ├── ScoutingBoard.jsx     # Advanced scouting
│   ├── PlayerComparison.jsx # Player comparison tool
│   ├── LineupBuilder.jsx    # Lineup construction
│   ├── TeamAnalytics.jsx    # Team performance
│   ├── DataViz.jsx     # Data visualization
│   ├── PlayerDetails.jsx    # Individual player pages
│   └── FaceOff.jsx     # Player face-off comparison
├── services/           # Data and API services
│   ├── illinoisDataService.js  # Main data service
│   └── fallbackData.js # Comprehensive fallback data
└── utils/              # Utility functions
    └── dataUtils.js    # Data processing utilities

backend/
├── server.js           # Express server with API endpoints
└── package.json        # Backend dependencies
```

## 🔗 API Endpoints

### Player Data
- `GET /api/comprehensive-data` - All platform data
- `GET /api/barttorvik` - Illinois roster from BartTorvik
- `GET /api/maxpreps` - High school stat leaders
- `GET /api/247sports-recruiting/:class` - Recruiting data
- `GET /api/illinois-roster` - Current Illinois roster

### Team Analytics
- `GET /api/kenpom-team/:team` - KenPom team statistics
- `GET /api/kenpom-team/Illinois` - Illinois team stats

## 🎨 Design System

### Colors
- **Primary Orange**: `#e84a27` (Illinois Orange)
- **Primary Blue**: `#13294b` (Illinois Navy)
- **Secondary Colors**: Material-UI palette with Illinois theming

### Typography
- **Headings**: Material-UI typography scale
- **Body Text**: Optimized for readability
- **Data Display**: Monospace for statistics

## 📈 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Rendering**: React.memo and useMemo for performance
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during data fetching

## 🔐 Data Privacy & Security

- No personal data storage
- Public data sources only
- CORS protection
- Input validation and sanitization

## 🚦 Development Workflow

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start:backend` - Start backend server
- `npm run start:full` - Start both frontend and backend

### Environment Variables
Create a `.env` file for any API keys or configuration:
```
VITE_API_BASE_URL=http://localhost:3002
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- Illinois Men's Basketball program
- BartTorvik for college basketball analytics
- KenPom for advanced metrics
- 247Sports for recruiting data
- MaxPreps for high school statistics

## 📞 Support

For questions or support, please contact the Illinois Men's Basketball Analytics team.

---

**Built with ❤️ for Illinois Basketball** 🔶🔷


