<template>
  <div class="transfer-history-page">
    <h2>历史转会信息</h2>
    <el-form
      inline
      label-position="top"
      @submit.native.prevent="fetchTransferHistory"
    >
      <el-form-item label="Team ID">
        <el-input
          v-model="queryParams.teamid"
          placeholder="输入 team ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="From Team ID">
        <el-input
          v-model="queryParams.fromteamid"
          placeholder="输入 from team ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="To Team ID">
        <el-input
          v-model="queryParams.toteamid"
          placeholder="输入 to team ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="Player ID">
        <el-input
          v-model="queryParams.playerid"
          placeholder="输入 player ID"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchTransferHistory">搜索</el-button>
      </el-form-item>
    </el-form>

    <ul v-if="transferHistory.length > 0">
      <li v-for="(transfer, index) in transferHistory" :key="index">
        {{ transfer.PLAYER_NAME }} 从 {{ transfer.TEAM_NAME_FROM }} 转会到
        {{ transfer.TEAM_NAME_TO }}，费用:
        {{ formatTransferFee(transfer.TRANSFER_FEES) }}，日期:
        {{ formatDate(transfer.TRANSFER_DATE) }}
      </li>
    </ul>
    <p v-else>没有找到相关的转会信息。</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      queryParams: {
        teamid: "",
        fromteamid: "",
        toteamid: "",
        playerid: "",
      },
      transferHistory: [],
    };
  },
  methods: {
    fetchTransferHistory() {
      // 构造查询参数
      const params = {};
      if (this.queryParams.teamid) params.teamid = this.queryParams.teamid;
      if (this.queryParams.fromteamid)
        params.fromteamid = this.queryParams.fromteamid;
      if (this.queryParams.toteamid)
        params.toteamid = this.queryParams.toteamid;
      if (this.queryParams.playerid)
        params.playerid = this.queryParams.playerid;

      // 仅在有查询参数时才附加 `params`
      const axiosConfig = Object.keys(params).length > 0 ? { params } : {};

      axios
        .get("/api/v1/transfer/displayall", axiosConfig)
        .then((response) => {
          this.transferHistory = response.data; // 根据实际 API 响应格式调整
          console.log("Received data:", response.data);
        })
        .catch((error) => {
          console.error("获取转会信息时发生错误:", error);
        });
    },
    formatTransferFee(fee) {
      return fee.toLocaleString(); // 将费用格式化为带有千位分隔符的形式
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options); // 格式化日期
    },
  },
  created() {
    this.fetchTransferHistory(); // 初次加载时获取全部数据
  },
};
</script>

<style scoped>
.transfer-history-page {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.el-form-item {
  margin-right: 16px;
}

.el-form-item:last-child {
  margin-right: 0;
}
</style>
