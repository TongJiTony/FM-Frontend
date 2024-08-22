<template>
  <div class="transfer-page">
    <!-- 左侧搜索框 -->
    <div class="search-box">
      <el-form label-position="top">
        <el-form-item label="位置筛选">
          <el-select v-model="filters.position" placeholder="选择位置">
            <el-option label="前锋" value="前锋"></el-option>
            <el-option label="中场" value="中场"></el-option>
            <el-option label="后卫" value="后卫"></el-option>
            <el-option label="门将" value="门将"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能力值筛选">
          <el-slider
            v-model="filters.ability"
            :min="60"
            :max="100"
            show-input
          ></el-slider>
        </el-form-item>
      </el-form>
    </div>

    <!-- 右侧球员列表 -->
    <div class="player-list">
      <el-table :data="filteredPlayers">
        <el-table-column prop="name" label="球员名"></el-table-column>
        <el-table-column prop="position" label="位置"></el-table-column>
        <el-table-column prop="ability" label="能力值"></el-table-column>
        <el-table-column
          prop="transferStatus"
          label="转会状态"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      filters: {
        position: null, // 筛选位置
        ability: null, // 筛选能力值
      },
      players: [], // 从API获取的球员数据
    };
  },

  computed: {
    filteredPlayers() {
      return this.players.filter((player) => {
        const positionMatch =
          !this.filters.position ||
          player.position.includes(this.filters.position);
        const abilityMatch =
          !this.filters.ability || player.ability >= this.filters.ability;
        const transferMatch = player.transferStatus === "允许转会";

        return positionMatch && abilityMatch && transferMatch;
      });
    },
  },

  methods: {
    fetchPlayers() {
      const teamId = this.$route.params.teamId;
      if (teamId) {
        console.log("Fetching data for team ID:", teamId);
        axios
          .get(`/api/v1/player/transferlist?teamid=${teamId}`)
          .then((response) => {
            console.log("Received data:", response.data);
            this.players = response.data;
          })
          .catch((error) => {
            console.error(
              "Failed to fetch player transfer list for team:",
              error
            );
          });
      } else {
        console.log("Fetching all transfer data");
        axios
          .get("/api/v1/player/transferlist")
          .then((response) => {
            console.log("Received data:", response.data);
            this.players = response.data;
          })
          .catch((error) => {
            console.error("Failed to fetch player transfer list:", error);
          });
      }
    },
  },

  created() {
    // 页面加载时获取转会数据
    this.fetchPlayers();
  },
};
</script>

<style scoped>
.transfer-page {
  display: flex;
}

.search-box {
  width: 20%;
  padding: 10px;
}

.player-list {
  width: 80%;
  padding: 10px;
}
</style>
