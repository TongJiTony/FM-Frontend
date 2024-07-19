<template>
  <div class="player-display">
    <el-card shadow="always">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="player-image">
            <img src="path/to/placeholder-image.png" alt="Player Image" />
          </div>
        </el-col>
        <el-col :span="18" class="player-info">
          <h2>{{ player[0].PLAYER_NAME }}</h2>
          <el-row :gutter="20">
            <el-col :span="12"><p><strong>球员编号:</strong> <el-tag>{{ player[0].PLAYER_ID }}</el-tag></p></el-col>
            <el-col :span="12"><p><strong>生日:</strong> <el-tag>{{ player[0].BIRTHDAY }}</el-tag></p></el-col>
            <el-col :span="12"><p><strong>队伍:</strong> <el-tag>{{ player[0].TEAM_NAME }}</el-tag></p></el-col>
            <el-col :span="12"><p><strong>位置:</strong> <el-tag>{{ player[0].ROLE }}</el-tag></p></el-col>
            <el-col :span="12">
              <p><strong>惯用脚:</strong>
                <el-tag v-if="player[0].USED_FOOT === 1">左脚</el-tag>
                <el-tag v-else>右脚</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p><strong>健康状态:</strong>
                <el-tag v-if="player[0].HEALTH_STATE === 1">健康</el-tag>
                <el-tag v-else>受伤</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p><strong>比赛状态:</strong>
                <el-tag v-if="player[0].GAME_STATE === 1">允许出场</el-tag>
                <el-tag v-else>禁赛</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p><strong>转会状态:</strong>
                <el-tag v-if="player[0].TRANS_STATE === 1">允许转会</el-tag>
                <el-tag v-else>禁止转会</el-tag>
              </p>
            </el-col>
            <el-col :span="12"><p><strong>评分:</strong> <el-tag>{{ player[0].RANK }}</el-tag></p></el-col>
            <el-col :span="12"><p><strong>显示状态:</strong> <el-tag>{{ player[0].IS_SHOW }}</el-tag></p></el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <p v-if="loading" class="loading-text">Loading player data...</p>
    <div v-else>
      <div v-if="!player">
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
      axios.get(`/api/v1/player/displayone?playerid=${playerId}`)
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

.player-image {
  width: 100%;
  height: 300px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.player-image img {
  max-width: 100%;
  max-height: 100%;
}

.player-info {
  display: flex;
  flex-wrap: wrap;
}

.player-info p {
  margin-bottom: 1rem;
}

.player-info p strong {
  margin-right: 0.5rem;
}

.el-tag {
  margin-left: 1rem;
  background-color: #e0f7fa;
  color: #00796b;
}

.loading-text {
  text-align: center;
  font-size: 1.5rem;
  color: #666666;
}
</style>
