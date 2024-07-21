<template>
  <div>
    <el-table
      :data="pagedData"
      border
      style="width: 100%">
      <el-table-column
        prop="PLAYER_ID"
        label="球员编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="TEAM_NAME"
        label="队伍"
        width="150">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        label="位置"
        width="150">
      </el-table-column>
      <!--      
      <el-table-column
        prop="BIRTHDAY"
        label="生日"
        width="150">
      </el-table-column>
      <el-table-column
        label="惯用脚"
        width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.USED_FOOT === 1">左脚</el-tag>
          <el-tag v-else>右脚</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="健康状态"
        width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.HEALTH_STATE === 1">健康</el-tag>
          <el-tag v-else>受伤</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="RANK"
        label="评分"
        width="150">
      </el-table-column>
      <el-table-column
        label="比赛状态"
        width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.GAME_STATE === 1">允许出场</el-tag>
          <el-tag v-else>禁赛</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="转会状态"
        width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.TRANS_STATE === 1">允许转会</el-tag>
          <el-tag v-else>禁止转会</el-tag>
        </template>
      </el-table-column>
      -->
      <el-table-column
        fixed="right"
        label="Actions"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">View</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    handleClick(row) {
      this.$router.push(`/player-display/${row.PLAYER_ID}`);
    }
  }
};
</script>

<style scoped>
.player-list {
  padding: 1rem;
}

.el-tag {
  background-color: #e0f7fa;
  color: #00796b;
  margin-left: 1rem;
}

.el-table th, .el-table td {
  padding: 10px 20px;
}
</style>
