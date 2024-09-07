<template>
  <div class="transfer-history-page">
    <el-button
      type="primary"
      size="small"
      icon="el-icon-arrow-left"
      @click="goBack"
      class="back-button1"
      >返回</el-button
    >
    <h2>历史转会信息</h2>

    <el-form
      inline
      label-position="top"
      @submit.native.prevent="fetchTransferHistory"
    >
      <el-form-item label="球队编号">
        <el-input
          v-model="queryParams.teamid"
          placeholder="输入 球队编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="转出球队编号">
        <el-input
          v-model="queryParams.toteamid"
          placeholder="输入 转出球队编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="转入球队编号">
        <el-input
          v-model="queryParams.fromteamid"
          placeholder="输入 转入球队编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="球员编号">
        <el-input
          v-model="queryParams.playerid"
          placeholder="输入 球员编号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="fetchTransferHistory"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <ul v-if="transferHistory.length > 0">
      <li
        v-for="(transfer, index) in transferHistory"
        class="card-style"
        :key="index"
      >
        {{ transfer.PLAYER_NAME }} 从 {{ transfer.TEAM_NAME_TO }} 转会到
        {{ transfer.TEAM_NAME_FROM }}，费用:
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
      if (this.queryParams.toteamid)
        params.toteamid = this.queryParams.toteamid;
      if (this.queryParams.fromteamid)
        params.fromteamid = this.queryParams.fromteamid;
      if (this.queryParams.playerid)
        params.playerid = this.queryParams.playerid;

      // 仅在有查询参数时才附加 `params`
      const axiosConfig = Object.keys(params).length > 0 ? { params } : {};

      axios
        .get("/api/v1/transfer/displayall", axiosConfig)
        .then((response) => {
          this.transferHistory = response.data;
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
    goBack() {
      this.$router.go(-1);
    },
  },
  created() {
    this.fetchTransferHistory(); // 初次加载时获取全部数据
  },
};
</script>

<style scoped>
.back-button1 {
  float: right;
}
.card-style {
  background-color: rgba(255, 255, 255, 0.8);
}
.transfer-history-page {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
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
