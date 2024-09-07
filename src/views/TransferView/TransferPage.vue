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
            <el-option label="守门员" value="守门员"></el-option>
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
        <el-form-item>
          <el-button type="success" @click="goToTransferHistory"
            >查看历史转会信息</el-button
          >
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
          | 能力:{{ player.RANK }}
          <!-- 添加按钮 -->
          <el-button @click="openDialog(player)"> 向经纪人询问转会 </el-button>
        </li>
      </ul>
    </div>

    <!-- 对话框 -->
    <manager-dialog
      :visible="dialogVisible"
      :value="transferInfo"
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
        playerID: "",
        playerName: "", // 球员姓名
        teamIdFrom: "",
        teamNameFrom: "",
        teamIdTo: "",
        teamNameTo: "",
        teamId: "",
        teamName: "",
        startDate: "",
        endDate: "",
        transferFee: 0, // 转会费
        salary: 0, // 工资
        transferDate: "", // 转会时间
        //contractDuration: 0, // 合同年限
      }, // 用于存储传递和接收的转会信息
    };
  },
  computed: {
    // 获取当前用户的球队 ID
    currentTeamId() {
      return this.$store.getters["user/getTeamID"];
    },
  },

  watch: {
    dialogVisible() {
      // console.log("dialogVisible changed to:", newVal);
      this.fetchPlayers();
    },
  },
  methods: {
    // 新增的跳转到转会历史页面的方法
    goToTransferHistory() {
      this.$router.push({ name: "TransferHistory" });
    },

    // 点击"向经纪人询问转会"按钮时触发
    async openDialog(player) {
      //console.log("test the user id", this.$store.getters["user/getUserId"]);
      this.transferInfo.playerName = player.PLAYER_NAME; // 设置当前选中的球员姓名
      // console.log("Selected player:", this.transferInfo.playerName);

      try {
        const response = await axios.options(
          `/api/v1/agent/connect?userid=${this.$store.getters["user/getUserId"]}`
        );

        // console.log("API response 2 :", response);
        if (response.status === 200) {
          this.$message.success(response.data);
          this.transferInfo.playerID = player.PLAYER_ID;
          this.transferInfo.playerName = player.PLAYER_NAME;
          this.transferInfo.teamIdFrom = player.TEAM_ID;
          this.transferInfo.teamNameFrom = player.TEAM_NAME;
          // this.transferInfo.teamNameTo = this.$store.getters["user/getTeamID"];
          this.transferInfo.teamIdTo = this.$store.getters["user/getTeamID"];
          this.transferInfo.teamId = this.transferInfo.teamIdTo;
          console.log("Transfer info:", this.transferInfo);

          this.dialogVisible = true;
        } else {
          this.$message.error(response.data);
        }
      } catch (error) {
        console.error("Error fetching agent status:", error);
        this.$message.error("无法创建对话，经纪人正忙");
      }
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

    saveTransfer(transferInfo) {
      console.log("saveTransfer called with:", transferInfo);
      this.transferInfo = transferInfo;
    },

    fetchPlayers() {
      const fetchUrl = "/api/v1/player/displayall";

      axios
        .get(fetchUrl)
        .then((response) => {
          this.players = response.data;
          // 初始化时，筛选 TRANS_STATE 为 true 且不属于当前球队的球员
          this.initialFilteredPlayers = this.players.filter(
            (player) =>
              player.TRANS_STATE === 1 && player.TEAM_ID !== this.currentTeamId
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
    axios.options(
      `/api/v1/agent/disconnect?userid=${this.$store.getters["user/getUserId"]}`
    );
  },
};
</script>

<style scoped>
.card-style {
  background-color: rgba(255, 255, 255, 0.8);
}
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
  background-color: rgba(255, 255, 255, 0.8);
}

.player-list {
  flex: 3;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
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
.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.player-item:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.el-button {
  background-color: rgb(0, 153, 255);
  color: white;
}
</style>
