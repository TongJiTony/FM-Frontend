<template>
  <div class="transfer-page">
    <!-- 左侧搜索框 -->
    <div class="search-box">
      <el-form label-position="top">
        <el-form-item label="位置筛选">
          <el-select v-model="filters.position" placeholder="选择位置">
            <el-option label="前锋" value="F"></el-option>
            <el-option label="中场" value="M"></el-option>
            <el-option label="后卫" value="B"></el-option>
            <el-option label="门将" value="GK"></el-option>
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
        <el-form-item label="年龄筛选">
          <el-slider
            v-model="filters.age"
            :min="16"
            :max="40"
            show-input
          ></el-slider>
        </el-form-item>
        <!-- 确认筛选和重置筛选按钮 -->
        <el-form-item>
          <el-button type="primary" @click="applyFilters">确认筛选</el-button>
          <el-button @click="resetFilters">重置筛选</el-button>
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
          <!-- 显示球员的各项信息，包括年龄 -->
          球员名: {{ player.PLAYER_NAME }} | 球队: {{ player.TEAM_NAME }} |
          位置: {{ player.ROLE }} | 年龄: {{ calculateAge(player.BIRTHDAY) }} |
          惯用脚: {{ player.USED_FOOT === 1 ? "右脚" : "左脚" }} | 健康状态:{{
            player.HEALTH_STATE === 0 ? "健康" : "受伤"
          }}
          | 等级:{{ player.RANK }}
          <!-- 添加按钮 -->
          <el-button @click="openDialog(player)">
            向经纪人询问转会
          </el-button>
        </li>
      </ul>
    </div>

    <!-- 对话框 -->
    <manager-dialog
      :visible="dialogVisible"
      :value="transferInfo.playerName"
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
        ability: 60, // 筛选能力值，默认为最小值
        age: 16, // 筛选年龄，默认最小年龄为16岁
      },
      players: [], // 从API获取的球员数据
      initialFilteredPlayers: [], // 初始筛选后的球员列表（TRANS_STATE 为 true）
      filteredPlayers: [], // 根据筛选条件得到的球员数据
      loading: true,
      dialogVisible: false,
      transferInfo: {
        playerName: "", // 球员姓名
        transferFee: 0, // 转会费
        salary: 0, // 工资
        transferDate: "", // 转会时间
        contractDuration: 0, // 合同年限
      }, // 用于存储传递和接收的转会信息
    };
  },
  watch: {
    dialogVisible(newVal) {
      console.log("dialogVisible changed to:", newVal);
    },
  },
  methods: {
    // 点击"向经纪人询问转会"按钮时触发
    openDialog(player) {
      this.transferInfo.playerName = player.PLAYER_NAME; // 设置当前选中的球员姓名
      console.log("Selected player:", this.transferInfo.playerName);
      this.dialogVisible = true;
    },

    // 处理对话框返回的数据
    handleSaveTransfer(transferData) {
      // 将组件返回的数据保存到 transferInfo 中
      this.transferInfo = transferData;
      // 在这里决定是否立即发送数据到其他页面，或者存储在暂时的容器中以便稍后处理
      console.log("Transfer data received:", this.transferInfo);
    },

    // 计算球员年龄的函数
    calculateAge(birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--; // 如果还没过生日，则年龄减1
      }
      // 如果满一年不到，也算作一岁
      return age < 1 ? 1 : age;
    },

    /// 在这里确认
    saveTransfer(transferInfo) {
      console.log("saveTransfer called with:", transferInfo);
    },

    fetchPlayers() {
      const teamId = this.$route.params.teamId;
      const fetchUrl = teamId
        ? `/api/v1/player/displayall?teamid=${teamId}`
        : "/api/v1/player/displayall";

      axios
        .get(fetchUrl)
        .then((response) => {
          this.players = response.data;
          // 初始化时，筛选 TRANS_STATE 为 true 的球员
          this.initialFilteredPlayers = this.players.filter(
            (player) => player.TRANS_STATE === 1
          );
          // 设置初始显示列表和筛选列表为初始筛选结果
          this.filteredPlayers = [...this.initialFilteredPlayers];
        })
        .catch((error) => {
          console.error("Failed to fetch player transfer list:", error);
        });
    },

    applyFilters() {
      // 根据筛选条件更新 filteredPlayers
      this.filteredPlayers = this.initialFilteredPlayers.filter((player) => {
        const matchesPosition =
          this.filters.position === "" || player.ROLE === this.filters.position;
        const matchesAbility = player.RANK >= this.filters.ability;
        const matchesAge =
          this.calculateAge(player.BIRTHDAY) >= this.filters.age;
        return matchesPosition && matchesAbility && matchesAge;
      });
    },

    resetFilters() {
      // 重置筛选条件
      this.filters.position = "";
      this.filters.ability = 60;
      this.filters.age = 16;
      // 重置筛选结果为初始筛选结果
      this.filteredPlayers = [...this.initialFilteredPlayers];
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
