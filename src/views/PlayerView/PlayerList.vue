<template>
  <div class="player-list">
    <el-row :gutter="20" class="header-row" justify="end">
      <el-col :span="6">
        <el-input-group>
          <el-select v-model="searchType" placeholder="选择搜索类型" size="small">
            <el-option label="球员编号" value="PLAYER_ID"></el-option>
            <el-option label="姓名" value="PLAYER_NAME"></el-option>
            <el-option label="队伍" value="TEAM_NAME"></el-option>
            <el-option label="位置" value="ROLE"></el-option>
          </el-select>
          <el-input v-model="searchQuery" placeholder="输入搜索内容" size="small"></el-input>
          <el-button @click="handleSearch" type="primary" size="small">搜索</el-button>
          <el-button @click="resetSearch" type="text" size="small">重置</el-button>
        </el-input-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="(player, index) in pagedData" :key="index" :span="12">
        <el-card shadow="always" class="player-card">
          <h3>{{ player.PLAYER_NAME }}</h3>
          <p><strong>球员编号:</strong> {{ player.PLAYER_ID }}</p>
          <p><strong>队伍:</strong> {{ player.TEAM_NAME }}</p>
          <p><strong>位置:</strong> {{ player.ROLE }}</p>
          <el-button @click="handleClick(player)" type="text" size="small">View</el-button>
          <el-button @click="confirmDelete(player)" type="text" size="small" style="color: red;">Delete</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange">
    </el-pagination>

    <!-- Confirm Delete Dialog -->
    <el-dialog
      title="确认删除"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleDialogClose">
      <p>确定要删除球员 {{ selectedPlayer?.PLAYER_NAME }} 吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      searchType: 'PLAYER_ID',
      searchQuery: '',
      allData: [],
      dialogVisible: false,
      selectedPlayer: null
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
            this.allData = response.data;
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
            this.allData = response.data;
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
    handleClick(player) {
      this.$router.push(`/player-display/${player.PLAYER_ID}`);
    },
    handleSearch() {
      const searchType = this.searchType;
      const searchQuery = this.searchQuery.toLowerCase();
      this.tableData = this.allData.filter(player =>
        player[searchType].toString().toLowerCase().includes(searchQuery)
      );
      this.total = this.tableData.length;
      this.currentPage = 1;
      this.updatePagedData();
    },
    resetSearch() {
      this.tableData = this.allData;
      this.total = this.allData.length;
      this.searchQuery = '';
      this.currentPage = 1;
      this.updatePagedData();
    },
    confirmDelete(player) {
      this.selectedPlayer = player;
      this.dialogVisible = true;
    },
    handleDelete() {
      if (this.selectedPlayer) {
        axios.delete(`/api/v1/player/delete/${this.selectedPlayer.PLAYER_ID}`)
          .then(response => {
            console.log('Delete response:', response);
            this.tableData = this.tableData.filter(player => player.PLAYER_ID !== this.selectedPlayer.PLAYER_ID);
            this.total = this.tableData.length;
            this.updatePagedData();
            this.handleDialogClose();
          })
          .catch(error => {
            console.error('Failed to delete player:', error);
          });
      }
    },
    handleDialogClose() {
      this.dialogVisible = false;
      this.selectedPlayer = null;
    }
  }
};
</script>

<style scoped>
.player-list {
  padding: 1rem;
}

.header-row {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.el-input-group {
  display: flex;
  align-items: center;
}

.player-card {
  margin-bottom: 1rem;
}

.dialog-footer {
  text-align: right;
}
</style>
