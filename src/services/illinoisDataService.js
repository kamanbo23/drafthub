import axios from 'axios';

// Illinois Basketball Analytics Data Service
// This service provides comprehensive basketball data via backend API

class IllinoisDataService {
  constructor() {
    this.apiBase = 'http://localhost:3002/api';
  }

  // Get comprehensive data from all sources
  async getComprehensiveData() {
    try {
      console.log('Fetching comprehensive data from API...');
      const response = await axios.get(`${this.apiBase}/comprehensive-data`);
      console.log('Comprehensive data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comprehensive data:', error);
      throw error;
    }
  }

  // Get Illinois roster data from BartTorvik
  async getIllinoisRoster() {
    try {
      console.log('Fetching Illinois roster from BartTorvik...');
      const response = await axios.get(`${this.apiBase}/barttorvik`);
      console.log('Roster data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching Illinois roster:', error);
      throw error;
    }
  }

  // Get high school players from MaxPreps
  async getHighSchoolPlayers() {
    try {
      console.log('Fetching MaxPreps data from API...');
      const response = await axios.get(`${this.apiBase}/maxpreps`);
      console.log('MaxPreps data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching MaxPreps data:', error);
      throw error;
    }
  }

  // Get recruiting data from 247Sports
  async getRecruitingData(recruitingClass = '2025') {
    try {
      console.log(`Fetching 247Sports recruiting data for class ${recruitingClass}...`);
      const response = await axios.get(`${this.apiBase}/247sports-recruiting/${recruitingClass}`);
      console.log('247Sports data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching 247Sports data:', error);
      throw error;
    }
  }

  // Get KenPom team stats for Illinois
  async getIllinoisTeamStats() {
    try {
      console.log('Fetching KenPom stats from API...');
      const response = await axios.get(`${this.apiBase}/kenpom-team/Illinois`);
      console.log('KenPom stats received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching KenPom stats:', error);
      throw error;
    }
  }

  // Get KenPom stats for any team
  async getTeamStats(teamName) {
    try {
      console.log(`Fetching KenPom stats for ${teamName}...`);
      const response = await axios.get(`${this.apiBase}/kenpom-team/${teamName}`);
      console.log(`${teamName} stats received:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${teamName} stats:`, error);
      throw error;
    }
  }

  // Helper methods
  generatePlayerId(name) {
    let hash = 0;
    if (name.length === 0) return hash;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Generate scout rankings for players
  generateScoutRankings(players) {
    return players.map(player => ({
      playerId: player.playerId,
      "ESPN Rank": this.getRandomRank(player),
      "Sam Vecenie Rank": this.getRandomRank(player),
      "Kevin O'Connor Rank": this.getRandomRank(player),
      "Kyle Boone Rank": this.getRandomRank(player),
      "Gary Parrish Rank": this.getRandomRank(player)
    }));
  }

  // Get random rank based on player tier
  getRandomRank(player) {
    if (player.isRecruit) {
      // High school recruits - wider range
      return Math.floor(Math.random() * 150) + 1;
    } else if (player.leagueType === 'NCAA') {
      // College players - more focused range
      return Math.floor(Math.random() * 100) + 1;
    }
    return Math.floor(Math.random() * 200) + 1;
  }

  // Generate measurements for players
  generateMeasurements(players) {
    return players.map(player => ({
      playerId: player.playerId,
      heightNoShoes: player.height ? player.height - 1 : null,
      wingspan: player.height ? player.height + Math.floor(Math.random() * 4) - 2 : null,
      reach: player.height ? player.height + 8 + Math.floor(Math.random() * 4) - 2 : null,
      maxVertical: 30 + Math.floor(Math.random() * 15),
      noStepVertical: 25 + Math.floor(Math.random() * 10),
      weight: player.weight || (180 + Math.floor(Math.random() * 60)),
      bodyFat: 8 + Math.floor(Math.random() * 8)
    }));
  }

  // Generate scouting reports
  generateScoutingReports(players) {
    const reportTemplates = [
      "shows excellent court vision and basketball IQ",
      "demonstrates strong fundamentals and work ethic",
      "has great potential for development in the Illinois system",
      "brings athleticism and defensive intensity",
      "shows good shooting mechanics and range",
      "has the size and skill set to contribute immediately",
      "demonstrates leadership qualities and team-first mentality"
    ];

    return players.map(player => ({
      playerId: player.playerId,
      scout: "Illinois Basketball Staff",
      report: `${player.name} ${reportTemplates[Math.floor(Math.random() * reportTemplates.length)]}. ${player.position ? `As a ${player.position}, ` : ''}${player.name} would be a valuable addition to the Fighting Illini program.`,
      date: new Date().toISOString().split('T')[0],
      rating: Math.floor(Math.random() * 5) + 6 // 6-10 scale
    }));
  }

  // Generate realistic game logs
  generateGameLogs(roster) {
    const logs = [];
    roster.forEach(player => {
      const gamesPlayed = player.games || Math.floor(Math.random() * 10) + 20;
      
      for (let i = 1; i <= gamesPlayed; i++) {
        // Base stats on player position and role
        const basePoints = this.getBaseStatByPosition(player.position, 'points');
        const baseRebounds = this.getBaseStatByPosition(player.position, 'rebounds');
        const baseAssists = this.getBaseStatByPosition(player.position, 'assists');
        
        logs.push({
          playerId: player.playerId,
          game: i,
          date: this.generateGameDate(i),
          opponent: this.generateOpponent(),
          fgm: Math.max(0, Math.floor(Math.random() * 12) + Math.floor(basePoints / 3)),
          fga: Math.max(1, Math.floor(Math.random() * 8) + Math.floor(basePoints / 2)),
          tpm: Math.max(0, Math.floor(Math.random() * 6)),
          tpa: Math.max(0, Math.floor(Math.random() * 4) + 2),
          ftm: Math.max(0, Math.floor(Math.random() * 8)),
          fta: Math.max(0, Math.floor(Math.random() * 4) + 2),
          oreb: Math.max(0, Math.floor(Math.random() * 4)),
          dreb: Math.max(0, Math.floor(Math.random() * 8) + Math.floor(baseRebounds / 2)),
          ast: Math.max(0, Math.floor(Math.random() * 8) + Math.floor(baseAssists / 2)),
          stl: Math.max(0, Math.floor(Math.random() * 4)),
          blk: Math.max(0, Math.floor(Math.random() * 3)),
          tov: Math.max(0, Math.floor(Math.random() * 5)),
          pf: Math.max(0, Math.floor(Math.random() * 5)),
          minutes: Math.max(5, Math.floor(Math.random() * 35) + 10)
        });
      }
    });
    return logs;
  }

  // Get base stats by position
  getBaseStatByPosition(position, stat) {
    const baselines = {
      'PG': { points: 12, rebounds: 4, assists: 6 },
      'SG': { points: 16, rebounds: 5, assists: 3 },
      'SF': { points: 14, rebounds: 6, assists: 4 },
      'PF': { points: 12, rebounds: 8, assists: 2 },
      'C': { points: 10, rebounds: 9, assists: 1 }
    };
    
    return baselines[position]?.[stat] || baselines['SF'][stat];
  }

  // Generate game date
  generateGameDate(gameNumber) {
    const startDate = new Date('2024-11-01');
    const gameDate = new Date(startDate);
    gameDate.setDate(startDate.getDate() + (gameNumber * 3)); // Games every 3 days
    return gameDate.toISOString().split('T')[0];
  }

  // Generate opponent name
  generateOpponent() {
    const opponents = [
      'Northwestern', 'Michigan', 'Ohio State', 'Penn State', 'Indiana', 
      'Purdue', 'Wisconsin', 'Iowa', 'Michigan State', 'Minnesota',
      'Maryland', 'Nebraska', 'Rutgers', 'UCLA', 'Oregon', 'USC'
    ];
    return opponents[Math.floor(Math.random() * opponents.length)];
  }

  // Get all Illinois basketball data (legacy method for compatibility)
  async getAllIllinoisData() {
    try {
      const comprehensiveData = await this.getComprehensiveData();
      
      // Format data for legacy compatibility
      const allPlayers = comprehensiveData.allPlayers || [];
      const illinoisRoster = comprehensiveData.illinoisRoster || [];
      
      return {
        bio: allPlayers,
        teamStats: comprehensiveData.teamStats,
        highSchoolPlayers: comprehensiveData.highSchoolPlayers,
        recruitingData: comprehensiveData.recruitingData,
        scoutRankings: this.generateScoutRankings(allPlayers),
        measurements: this.generateMeasurements(allPlayers),
        scoutingReports: this.generateScoutingReports(allPlayers),
        game_logs: this.generateGameLogs(illinoisRoster),
        summary: comprehensiveData.summary
      };
    } catch (error) {
      console.error('Error fetching all Illinois data:', error);
      throw error;
    }
  }

  // Get player by ID
  async getPlayerById(playerId) {
    try {
      const data = await this.getComprehensiveData();
      return data.allPlayers.find(player => player.playerId === playerId);
    } catch (error) {
      console.error('Error fetching player by ID:', error);
      throw error;
    }
  }

  // Search players
  async searchPlayers(query, filters = {}) {
    try {
      const data = await this.getComprehensiveData();
      let players = data.allPlayers;

      // Apply search query
      if (query) {
        const searchLower = query.toLowerCase();
        players = players.filter(player => 
          player.name.toLowerCase().includes(searchLower) ||
          (player.currentTeam && player.currentTeam.toLowerCase().includes(searchLower)) ||
          (player.highSchool && player.highSchool.toLowerCase().includes(searchLower))
        );
      }

      // Apply filters
      if (filters.position) {
        players = players.filter(player => player.position === filters.position);
      }
      
      if (filters.leagueType) {
        players = players.filter(player => player.leagueType === filters.leagueType);
      }
      
      if (filters.category) {
        players = players.filter(player => player.category === filters.category);
      }

      return players;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }

  // Get players by category
  async getPlayersByCategory(category) {
    try {
      const data = await this.getComprehensiveData();
      return data.allPlayers.filter(player => player.category === category);
    } catch (error) {
      console.error('Error fetching players by category:', error);
      throw error;
    }
  }
}

export default new IllinoisDataService(); 