<template>
    <div class="player-display">
      <h1>Player Display Page</h1>
      <div v-if="player">
        <p><strong>ID:</strong> {{ player.PLAYER_ID }}</p>
        <p><strong>Name:</strong> {{ player.PLAYER_NAME }}</p>
        <p><strong>Birthday:</strong> {{ player.BIRTHDAY }}</p>
        <p><strong>Team ID:</strong> {{ player.TEAM_ID }}</p>
        <p><strong>Role:</strong> {{ player.ROLE }}</p>
        <p><strong>Used Foot:</strong> {{ player.USED_FOOT }}</p>
        <p><strong>Health State:</strong> {{ player.HEALTH_STATE }}</p>
        <p><strong>Rank:</strong> {{ player.RANK }}</p>
        <p><strong>Game State:</strong> {{ player.GAME_STATE }}</p>
        <p><strong>Transfer State:</strong> {{ player.TRANS_STATE }}</p>
        <p><strong>Is Show:</strong> {{ player.IS_SHOW }}</p>
      </div>
      <div v-else>
        <p>Loading player data...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PlayerDisplay',
    data() {
      return {
        player: null,
      };
    },
    created() {
      this.fetchPlayerData();
    },
    methods: {
      async fetchPlayerData() {
        try {
          const response = await axios.get('http://localhost:5253/v1/playerdisplay/1');
          this.player = response.data[0];
        } catch (error) {
          console.error('Failed to fetch player data:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .player-display {
    padding: 1rem;
  }
  </style>
  