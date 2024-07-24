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
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="球员编号" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_ID" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.BIRTHDAY"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="队伍ID" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_ID"></el-input>
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
        <el-form-item label="惯用脚" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.USED_FOOT">
            <el-radio :label="0">左脚</el-radio>
            <el-radio :label="1">右脚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.HEALTH_STATE">
            <el-radio :label="0">健康</el-radio>
            <el-radio :label="1">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input-number v-model="editForm.RANK" :min="0" :max="100" label="等级"></el-input-number>
        </el-form-item>
        <el-form-item label="场上状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.GAME_STATE">
            <el-radio :label="0">首发</el-radio>
            <el-radio :label="1">替补</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转会状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.TRANS_STATE">
            <el-radio :label="1">在转会</el-radio>
            <el-radio :label="0">不转会</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.IS_SHOW">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
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
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="PLAYER_NAME">
          <el-input v-model="addForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="BIRTHDAY">
          <el-date-picker v-model="addForm.BIRTHDAY" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="队伍ID" :label-width="formLabelWidth" prop="TEAM_ID">
          <el-input v-model="addForm.TEAM_ID" type="number"></el-input>
        </el-form-item>
        <el-form-item label="队伍名称" :label-width="formLabelWidth" prop="TEAM_NAME">
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
        <el-form-item label="惯用脚" :label-width="formLabelWidth" prop="USED_FOOT">
          <el-radio-group v-model="addForm.USED_FOOT">
            <el-radio :label="0">左脚</el-radio>
            <el-radio :label="1">右脚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth" prop="HEALTH_STATE">
          <el-radio-group v-model="addForm.HEALTH_STATE">
            <el-radio :label="0">健康</el-radio>
            <el-radio :label="1">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth" prop="RANK">
          <el-input v-model="addForm.RANK" type="number"></el-input>
        </el-form-item>
        <el-form-item label="场上状态" :label-width="formLabelWidth" prop="GAME_STATE">
          <el-radio-group v-model="addForm.GAME_STATE">
            <el-radio :label="0">首发</el-radio>
            <el-radio :label="1">替补</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转会状态" :label-width="formLabelWidth" prop="TRANS_STATE">
          <el-radio-group v-model="addForm.TRANS_STATE">
            <el-radio :label="1">在转会</el-radio>
            <el-radio :label="0">不转会</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth" prop="IS_SHOW">
          <el-radio-group v-model="addForm.IS_SHOW">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
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
      searchType: '',
      searchQuery: '',
      pagedData: [],
      total: 0,
      pageSize: 10,
      dialogVisible: false,
      selectedPlayer: null,
      editDialogVisible: false,
      editForm: {
        PLAYER_ID: '',        // 球员ID，必须要有
        PLAYER_NAME: '',      // 球员姓名
        BIRTHDAY: '',         // 出生日期
        TEAM_ID: '',          // 队伍ID
        TEAM_NAME: '',        // 队伍名称
        ROLE: '',             // 球员位置
        USED_FOOT: 0,         // 惯用脚
        HEALTH_STATE: 0,      // 健康状态
        RANK: 0,              // 球员等级
        GAME_STATE: 0,        // 场上状态
        TRANS_STATE: 0,       // 转会状态
        IS_SHOW: 1,           // 展示状态
      },
      formLabelWidth: '100px',
      addDialogVisible: false,
      addForm: {
        PLAYER_NAME: '',
        BIRTHDAY: '',
        TEAM_ID: '',
        TEAM_NAME: '',
        ROLE: '',
        USED_FOOT: 0,
        HEALTH_STATE: 0,
        RANK: 0,
        GAME_STATE: 0,
        TRANS_STATE: 0,
        IS_SHOW: 1,
      },
      addFormRules: {
        PLAYER_NAME: [{ required: true, message: '请输入球员姓名', trigger: 'blur' }],
        BIRTHDAY: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
        TEAM_ID: [{ required: true, message: '请输入队伍ID', trigger: 'blur' }],
        TEAM_NAME: [{ required: true, message: '请输入队伍名称', trigger: 'blur' }],
        ROLE: [{ required: true, message: '请选择位置', trigger: 'change' }],
        USED_FOOT: [{ required: true, message: '请选择惯用脚', trigger: 'change' }],
        HEALTH_STATE: [{ required: true, message: '请选择健康状态', trigger: 'change' }],
        RANK: [{ required: true, message: '请输入等级', trigger: 'blur' }],
        GAME_STATE: [{ required: true, message: '请选择场上状态', trigger: 'change' }],
        TRANS_STATE: [{ required: true, message: '请选择转会状态', trigger: 'change' }],
        IS_SHOW: [{ required: true, message: '请选择展示状态', trigger: 'change' }],
      },
      tableData: [],
      allData: [],
    };
  },
methods: {
  // Fetch players based on teamId or fetch all players
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

  // Navigate to player detail page
  handleClick(player) {
    console.log('Navigating to player detail page for:', player.PLAYER_ID);
    const playerId = player.PLAYER_ID;
    const route = `/player-display/${playerId}`;
    this.$router.push(route);
  },

  // Open add player dialog
  openAddPlayerDialog() {
    console.log('Opening add player dialog');
    this.addDialogVisible = true;
  },

  // Handle closing of dialogs
  handleDialogClose() {
    console.log('Closing delete confirmation dialog');
    this.dialogVisible = false;
  },

  handleAddDialogClose() {
    console.log('Closing add player dialog');
    this.addDialogVisible = false;
  },

  handleEditDialogClose() {
    console.log('Closing edit dialog');
    this.editDialogVisible = false;
  },

  // Confirm deletion of a player
  confirmDelete(player) {
    console.log('Confirming delete for player:', player.PLAYER_NAME);
    this.selectedPlayer = player;
    this.dialogVisible = true;
  },

  // Delete player with correct API endpoint
  handleDelete() {
    console.log('Deleting player:', this.selectedPlayer.PLAYER_NAME);
    axios.delete(`/api/v1/player/delete?playerid=${this.selectedPlayer.PLAYER_ID}`) //用delete方法！
      .then(() => {
        console.log('Player deleted successfully');
        this.fetchPlayers();
        this.dialogVisible = false;
      })
      .catch(error => {
        console.error('Failed to delete player:', error);
      });
  },

  // Confirm editing of a player
  confirmEdit(player) {
    console.log('Opening edit dialog for player:', player.PLAYER_NAME);
    this.editForm = { ...player };
    this.editDialogVisible = true;
  },

  // Save edited player data with correct API endpoint
    handleSave() {
    console.log('Saving player data for:', this.editForm.PLAYER_NAME);

    // 构建符合服务器要求的完整 JSON 对象
    const updatedPlayerData = {
      PLAYER_NAME: this.editForm.PLAYER_NAME,
      BIRTHDAY: this.editForm.BIRTHDAY,
      TEAM_ID: this.editForm.TEAM_ID,
      ROLE: this.editForm.ROLE,
      USED_FOOT: this.editForm.USED_FOOT,
      HEALTH_STATE: this.editForm.HEALTH_STATE,
      RANK: this.editForm.RANK,
      GAME_STATE: this.editForm.GAME_STATE,
      TRANS_STATE: this.editForm.TRANS_STATE,
      IS_SHOW: this.editForm.IS_SHOW
    };

    // 使用正确的 API 路径
    axios.post(`/api/v1/player/update?playerid=${this.editForm.PLAYER_ID}`, updatedPlayerData)
      .then(() => {
        console.log('Player updated successfully');
        this.fetchPlayers();
        this.editDialogVisible = false;
      })
      .catch(error => {
        console.error('Failed to update player:', error);
      });
  },

  // Add a new player
  handleAddPlayer() {
    console.log('Adding new player');
    this.$refs.addFormRef.validate((valid) => {
      if (valid) {
        axios.post('/api/v1/player/add', this.addForm)
          .then(() => {
            console.log('Player added successfully');
            this.fetchPlayers();
            this.addDialogVisible = false;
          })
          .catch(error => {
            console.error('Failed to add player:', error);
          });
      }
    });
  },

  // Perform a search
  handleSearch() {
    console.log('Performing search with type:', this.searchType, 'and query:', this.searchQuery);
    if (this.searchType && this.searchQuery) {
      this.pagedData = this.allData.filter(player => {
        return player[this.searchType].toString().includes(this.searchQuery);
      });
      this.total = this.pagedData.length;
      this.updatePagedData();
    } else {
      console.warn('Search type or query is missing');
    }
  },

  // Reset search criteria
  resetSearch() {
    console.log('Resetting search');
    this.searchType = '';
    this.searchQuery = '';
    this.pagedData = this.allData;
    this.total = this.allData.length;
    this.updatePagedData();
  },

  // Handle pagination page change
  handleCurrentChange(page) {
    console.log('Changing page to:', page);
    this.updatePagedData(page);
  },

  // Update paged data
  updatePagedData(currentPage = 1) {
    console.log('Updating paged data for page:', currentPage);
    const start = (currentPage - 1) * this.pageSize;
    const end = currentPage * this.pageSize;
    this.pagedData = this.allData.slice(start, end);
  }
},

created() {
  this.fetchPlayers();
}
,
};
</script>

<style scoped>
.player-list {
  padding: 20px;
}

.header-row {
  margin-bottom: 20px;
}

.el-input-group {
  display: flex;
  align-items: center;
}

.player-card {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
