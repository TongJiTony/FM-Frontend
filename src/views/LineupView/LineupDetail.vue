<template>
  <p v-if="loading">Loading...</p>
  <div v-else class="lineup-detail">
    <el-header>阵容 ID: {{ this.$route.params.lineupId }}
      <div class = "button-contanier">
        <el-button type="primary" class = "add_button" @click="addLineup">修改阵容</el-button>
        <el-button type="info" class = "goback_button" @click="goback">返回上级页面</el-button>
      </div>
    </el-header>
      
    <el-table
      :data="lineupDetail"
      stripe style="width: 100%">
      <el-table-column type="index" :width="100" />
      <el-table-column
        prop="PLAYER_ID"
        label="Player ID"
        width="300">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        label="Player Name"
        width="300">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        label="Role"
        width="300">
      </el-table-column>
      <el-table-column
        prop="HEALTH_STATE"
        label="Health State"
        width="300">
      </el-table-column>
      <el-table-column
        label="Actions"
        width="150">
        <template slot-scope="scope">
          <el-button size = "small" @click="handleClick(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'LineupDetail',
    data() {
      return {
        lineupDetail: []
      }
    },
    created() {
      const lineupid = this.$route.params.lineupId
      this.fetchLineupDetail(lineupid)
    },
    methods: {
      fetchLineupDetail(lineupid) {
        console.log(`/api/v1/player/displayall?lineupid=${lineupid}`);
        axios.get(`/api/v1/player/displayall?lineupid=${lineupid}`)
          .then(response => {
            this.lineupDetail = response.data;
          })
          .catch(error => {
            console.error(error);
          })
      },
      handleClick(row) {
        this.$router.push(`/player-display/${row.PLAYER_ID}`);
      },
      goback() {
        window.sessionStorage.clear();
        this.$router.go(-1);
    },
    }
  }
  </script>
  
<style scoped>
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items:center;
    color:#fff;
    font-size: 20px;
  }
  .button-contanier{
    display: flex;
    justify-content: flex-end;
  }
</style>
  
