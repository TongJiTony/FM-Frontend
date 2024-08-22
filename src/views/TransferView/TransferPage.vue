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
      <ul>
        <li
          v-for="(player, index) in filteredPlayers"
          :key="index"
          class="player-item"
        >
          <!-- 显示球员的各项信息 -->
          球员名: {{ player.PLAYER_NAME }} | 球队: {{ player.TEAM_NAME }} |
          位置: {{ player.ROLE }} | 惯用脚:
          {{ player.USED_FOOT === 1 ? "右脚" : "左脚" }} | 健康状态:{{
            player.HEALTH_STATE === 0 ? "健康" : "受伤"
          }}
          | 等级:{{ player.RANK }}
          <!-- 添加按钮 -->
          <el-button @click="dialogVisible = true">
            向经纪人询问转会
          </el-button>
        </li>
      </ul>
    </div>

    <!-- 对话框 -->
    <manager-dialog
      :visible="dialogVisible"
      @close="dialogVisible = false"
      @save="saveTransfer"
    ></manager-dialog>
  </div>
</template>

<script>
import axios from "axios";
import managerDialog from "@/views/TransferView/managerDialog.vue";

export default {
  components: { managerDialog },
  data() {
    return {
      filters: {
        position: "", // 筛选位置
        ability: "", // 筛选能力值
      },
      players: [], // 从API获取的球员数据
      loading: true,
      dialogVisible: false,
    };
  },
  watch: {
    dialogVisible(newVal) {
      console.log("dialogVisible changed to:", newVal);
    },
  },

  computed: {
    // 计算属性：筛选允许转会的球员
    filteredPlayers() {
      return this.players.filter((player) => player.TRANS_STATE === 1); // 仅返回允许转会的球员
    },
  },

  methods: {
    saveTransfer(transferInfo) {
      console.log("saveTransfer called with:", transferInfo);
    },

    fetchPlayers() {
      const teamId = this.$route.params.teamId;
      if (teamId) {
        console.log("Fetching data for team ID:", teamId);
        axios
          .get(`/api/v1/player/displayall?teamid=${teamId}`)
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
          .get("/api/v1/player/displayall")
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
  justify-content: space-between;
  padding: 20px;
}

.search-box {
  flex: 1;
  margin-right: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.player-list {
  flex: 3;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.player-list ul {
  list-style: none;
  padding: 0;
}

.player-list li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.player-item:hover {
  background-color: #e0e0e0;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-button {
  background-color: rgb(0, 153, 255);
  color: white;
}
</style>
