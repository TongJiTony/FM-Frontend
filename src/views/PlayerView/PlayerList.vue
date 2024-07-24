<template>
  <div class="player-list">
    <el-row :gutter="20" class="header-row" justify="end">
      <el-col :span="18">
        <el-button @click="openAddPlayerDialog" type="primary" size="small" style="margin-bottom: 1rem;">添加球员</el-button>
      </el-col>
      <el-col :span="6">
        <el-input-group class="el-input-group">
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
          <el-button @click="handleClick(player)" type="text" size="small">详情</el-button>
          <el-button @click="confirmEdit(player)" type="text" size="small" style="color: blue;">编辑</el-button>
          <el-button @click="confirmDelete(player)" type="text" size="small" style="color: red;">删除</el-button>
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

    <!-- Edit Player Dialog -->
    <el-dialog
      title="修改球员信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose">
      <el-form :model="editForm">
        <el-form-item label="球员编号" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_ID" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item label="队伍" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-select v-model="editForm.ROLE" placeholder="选择位置">
            <el-option label="守门员 (GK)" value="GK"></el-option>
            <el-option label="后卫 (B)" value="B"></el-option>
            <el-option label="中场 (M)" value="M"></el-option>
            <el-option label="前锋 (F)" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.HEALTH_STATUS">
            <el-radio label="健康">健康</el-radio>
            <el-radio label="受伤">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="场上状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.PLAYING_STATUS">
            <el-radio label="首发">首发</el-radio>
            <el-radio label="替补">替补</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转会状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.TRANSFER_STATUS">
            <el-radio label="在转会">在转会</el-radio>
            <el-radio label="不转会">不转会</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>

    <!-- Add Player Dialog -->
    <el-dialog
      title="添加球员"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="球员编号" :label-width="formLabelWidth" prop="PLAYER_ID">
          <el-input v-model="addForm.PLAYER_ID"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="PLAYER_NAME">
          <el-input v-model="addForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item label="队伍" :label-width="formLabelWidth" prop="TEAM_NAME">
          <el-input v-model="addForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="ROLE">
          <el-select v-model="addForm.ROLE" placeholder="选择位置">
            <el-option label="守门员 (GK)" value="GK"></el-option>
            <el-option label="后卫 (B)" value="B"></el-option>
            <el-option label="中场 (M)" value="M"></el-option>
            <el-option label="前锋 (F)" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth" prop="HEALTH_STATUS">
          <el-radio-group v-model="addForm.HEALTH_STATUS">
            <el-radio label="健康">健康</el-radio>
            <el-radio label="受伤">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="场上状态" :label-width="formLabelWidth" prop="PLAYING_STATUS">
          <el-radio-group v-model="addForm.PLAYING_STATUS">
            <el-radio label="首发">首发</el-radio>
            <el-radio label="替补">替补</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转会状态" :label-width="formLabelWidth" prop="TRANSFER_STATUS">
          <el-radio-group v-model="addForm.TRANSFER_STATUS">
            <el-radio label="在转会">在转会</el-radio>
            <el-radio label="不转会">不转会</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddPlayer">添加</el-button>
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
      editDialogVisible: false,
      addDialogVisible: false,
      selectedPlayer: null,
      editForm: {
        PLAYER_ID: '',
        PLAYER_NAME: '',
        TEAM_NAME: '',
        ROLE: '',
        HEALTH_STATUS: '',
        PLAYING_STATUS: '',
        TRANSFER_STATUS: ''
      },
      addForm: {
        PLAYER_ID: '',
        PLAYER_NAME: '',
        TEAM_NAME: '',
        ROLE: '',
        HEALTH_STATUS: '',
        PLAYING_STATUS: '',
        TRANSFER_STATUS: ''
      },
      addFormRules: {
        PLAYER_ID: [
          { required: true, message: '请输入球员编号', trigger: 'blur' }
        ],
        PLAYER_NAME: [
          { required: true, message: '请输入球员姓名', trigger: 'blur' }
        ],
        TEAM_NAME: [
          { required: true, message: '请输入队伍名称', trigger: 'blur' }
        ],
        ROLE: [
          { required: true, message: '请选择位置', trigger: 'change' }
        ],
        HEALTH_STATUS: [
          { required: true, message: '请选择健康状态', trigger: 'change' }
        ],
        PLAYING_STATUS: [
          { required: true, message: '请选择场上状态', trigger: 'change' }
        ],
        TRANSFER_STATUS: [
          { required: true, message: '请选择转会状态', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px'
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
    confirmEdit(player) {
      this.selectedPlayer = player;
      this.editForm = { ...player };  // Create a shallow copy of player data
      this.editDialogVisible = true;
    },
    handleSave() {
      const updatedPlayer = { ...this.editForm };
      axios.put(`/api/v1/player/update/${updatedPlayer.PLAYER_ID}`, updatedPlayer)
        .then(response => {
          console.log('Update response:', response);
          const index = this.tableData.findIndex(player => player.PLAYER_ID === updatedPlayer.PLAYER_ID);
          if (index !== -1) {
            this.tableData.splice(index, 1, updatedPlayer);
            this.updatePagedData();
          }
          this.handleEditDialogClose();
        })
        .catch(error => {
          console.error('Failed to update player:', error);
        });
    },
    handleEditDialogClose() {
      this.editDialogVisible = false;
      this.selectedPlayer = null;
      this.editForm = {
        PLAYER_ID: '',
        PLAYER_NAME: '',
        TEAM_NAME: '',
        ROLE: '',
        HEALTH_STATUS: '',
        PLAYING_STATUS: '',
        TRANSFER_STATUS: ''
      };
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
    },
    openAddPlayerDialog() {
      this.addDialogVisible = true;
    },
    handleAddPlayer() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          axios.post('/api/v1/player/add', this.addForm)
            .then(response => {
              console.log('Add player response:', response);
              this.tableData.push(response.data);  // Add the new player to the tableData
              this.allData.push(response.data);  // Add the new player to the allData
              this.total = this.tableData.length;
              this.updatePagedData();
              this.handleAddDialogClose();
            })
            .catch(error => {
              console.error('Failed to add player:', error);
            });
        } else {
          console.log('Error: Invalid input');
          return false;
        }
      });
    },
    handleAddDialogClose() {
      this.addDialogVisible = false;
      this.addForm = {
        PLAYER_ID: '',
        PLAYER_NAME: '',
        TEAM_NAME: '',
        ROLE: '',
        HEALTH_STATUS: '',
        PLAYING_STATUS: '',
        TRANSFER_STATUS: ''
      };
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
  margin-right: 1rem;
}

.player-card {
  margin-bottom: 1rem;
}

.dialog-footer {
  text-align: right;
}
</style>
