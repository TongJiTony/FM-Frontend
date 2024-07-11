<template>
    <div>
      <h1>Player Display Page</h1>
      <p v-if="loading">Loading player data...</p>
      <div v-else>
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
          <p>No player data available.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loading: true,
        player: null
      };
    },
    created() {
      axios.get('/api/v1/playerdisplay/1')
        .then(response => {
          this.player = response.data[0];
          this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch player data:', error);
          this.loading = false;
        });
    }
  };
  </script>
  
  <style scoped>
  .player-display {
    padding: 1rem;
  }
  </style>
  