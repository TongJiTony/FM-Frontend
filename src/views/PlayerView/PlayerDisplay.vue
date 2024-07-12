<template>
  <div>
    <h1>Player Display Page</h1>
    <p v-if="loading">Loading player data...</p>
    <div v-else>
      <div v-if="player">
        <p><strong>ID:</strong> {{ player[0].PLAYER_ID}}</p>
        <p><strong>Name:</strong> {{ player[0].PLAYER_NAME }}</p>
        <p><strong>Birthday:</strong> {{ player[0].BIRTHDAY }}</p>
        <p><strong>Team ID:</strong> {{ player[0].TEAM_ID }}</p>
        <p><strong>Role:</strong> {{ player[0].ROLE }}</p>
        <p><strong>Used Foot:</strong> {{ player[0].USED_FOOT }}</p>
        <p><strong>Health State:</strong> {{ player[0].HEALTH_STATE }}</p>
        <p><strong>Rank:</strong> {{ player[0].RANK }}</p>
        <p><strong>Game State:</strong> {{ player[0].GAME_STATE }}</p>
        <p><strong>Transfer State:</strong> {{ player[0].TRANS_STATE }}</p>
        <p><strong>Is Show:</strong> {{ player[0].IS_SHOW }}</p>
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
    this.fetchPlayerData();
  },
  methods: {
    fetchPlayerData() {
      const playerId = this.$route.params.playerId;
      console.log('Fetching data for player ID:', playerId);
      axios.get(`/api/v1/player/${playerId}`)
        .then(response => {
          console.log('Received data:', response.data);
          this.player = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch player data:', error);
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.player-display {
  padding: 1rem;
}
</style>
