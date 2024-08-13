<template>
  <div class="player-display">
    <el-card shadow="always">
      <!-- Back Button -->
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click="goBack"
        class="back-button"
      >
        返回
      </el-button>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="player-image">
            <img :src="player[0].icon" alt="Player Image" />
          </div>
        </el-col>
        <el-col :span="18" class="player-info">
          <h2>{{ player[0].PLAYER_NAME }}</h2>
          <el-row :gutter="20">
            <el-col :span="12">
              <p>
                <strong>球员编号:</strong>
                <el-tag>{{ player[0].PLAYER_ID }}</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>生日:</strong>
                <el-tag>{{ player[0].BIRTHDAY }}</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>队伍:</strong>
                <el-tag>{{ player[0].TEAM_NAME }}</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>位置:</strong>
                <el-tag>{{ player[0].ROLE }}</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>惯用脚:</strong>
                <el-tag>{{
                  player[0].USED_FOOT === 1 ? "右脚" : "左脚"
                }}</el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>健康状态:</strong>
                <el-tag
                  :type="player[0].HEALTH_STATE === 1 ? 'danger' : 'success'"
                  >{{ player[0].HEALTH_STATE === 1 ? "受伤" : "健康" }}</el-tag
                >
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>比赛状态:</strong>
                <el-tag
                  :type="player[0].GAME_STATE === 1 ? 'danger' : 'success'"
                  >{{
                    player[0].GAME_STATE === 1 ? "禁赛" : "允许出场"
                  }}</el-tag
                >
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>转会状态:</strong>
                <el-tag
                  :type="player[0].TRANS_STATE === 1 ? 'success' : 'danger'"
                  >{{
                    player[0].TRANS_STATE === 1 ? "允许转会" : "禁止转会"
                  }}</el-tag
                >
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>评分:</strong>
                <el-progress
                  type="circle"
                  :percentage="player[0].RANK"
                ></el-progress>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <strong>显示状态:</strong>
                <el-tag>{{ player[0].IS_SHOW }}</el-tag>
              </p>
            </el-col>
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
import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      player: null,
    };
  },
  created() {
    this.fetchPlayerData();
  },
  methods: {
    fetchPlayerData() {
      const playerId = this.$route.params.playerId;
      console.log("Fetching data for player ID:", playerId);
      axios
        .get(`/api/v1/player/displayone?playerid=${playerId}`)
        .then((response) => {
          console.log("Received data:", response.data);
          this.player = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Failed to fetch player data:", error);
          this.loading = false;
        });
    },
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
  },
};
</script>

<style scoped>
.player-display {
  padding: 1rem;
}

.back-button {
  margin-bottom: 1rem;
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  margin-left: 10px;
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
  margin-right: 1rem;
}

.el-tag {
  margin-left: 1rem;
}

.el-tag.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.el-tag.danger {
  background-color: #f2dede;
  color: #a94442;
}

.loading-text {
  text-align: center;
  font-size: 1.5rem;
  color: #666666;
}
</style>
