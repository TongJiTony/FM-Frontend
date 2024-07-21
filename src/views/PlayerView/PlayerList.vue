<template>
  <div class="player-list">
    <el-row :gutter="20">
      <el-col v-for="(player, index) in pagedData" :key="index" :span="12">
        <el-card shadow="always" class="player-card">
          <h3>{{ player.PLAYER_NAME }}</h3>
          <p><strong>球员编号:</strong> {{ player.PLAYER_ID }}</p>
          <p><strong>队伍:</strong> {{ player.TEAM_NAME }}</p>
          <p><strong>位置:</strong> {{ player.ROLE }}</p>
          <el-button @click="handleClick(player)" type="text" size="small">View</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      const teamId = this.$route.params.teamId;
      if (teamId) {
        console.log('Fetching data for team ID:', teamId);
        axios.get(`/api/v1/player/displayall?teamid=${teamId}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.tableData = response.data;
            this.total = response.data.length;
            this.updatePagedData();
          })
          .catch(error => {
            console.error('Failed to fetch player list for team:', error);
          });
      } else {
        console.log('Fetching all players');
        axios.get('/api/v1/player/displayall')
          .then(response => {
            console.log('Received data:', response.data);
            this.tableData = response.data;
            this.total = response.data.length;
            this.updatePagedData();
          })
          .catch(error => {
            console.error('Failed to fetch player list:', error);
          });
      }
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.pagedData = this.tableData.slice(start, end);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.updatePagedData();
    },
    handleClick(player) {
      this.$router.push(`/player-display/${player.PLAYER_ID}`);
    }
  }
};
</script>

<style scoped>
.player-list {
  padding: 1rem;
}

.player-card {
  margin-bottom: 1rem;
}
</style>
