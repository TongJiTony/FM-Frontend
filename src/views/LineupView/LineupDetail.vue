<template>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <el-header>阵容 ID: {{ this.$route.params.lineupId }}
      <div class="button-contanier">
        <el-button
          type="primary"
          class="add_button"
          @click="handleEdit"
        >修改阵容</el-button>
        <el-button
          type="info"
          class="goback_button"
          @click="goback"
        >返回上级页面</el-button>
      </div>
    </el-header>

    <el-table
      :data="filteredLineupData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        :width="100"/>
      <el-table-column
        prop="PLAYER_ID"
        label="编号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        label="姓名"
        width="250">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        label="位置"
        width="200">
        <template slot-scope="scope">
          <el-tag round="true"> {{ scope.row.ROLE }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="HEALTH_STATE"
        label="健康状态"
        width="230">
        <template slot-scope="scope">
          <el-tag :type="scope.row.HEALTH_STATE === 0 ? 'success' : 'danger'">
            {{ scope.row.HEALTH_STATE === 0 ? '健康' : '受伤' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="GAME_STATE"
        label="比赛状态"
        width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.GAME_STATE === 1 ? 'success' : 'danger'">
            {{ scope.row.GAME_STATE === 1 ? '允许出场' : '禁赛' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        align="center">
        <template #header>
          <div class='el-input-group'>
            <el-select
              v-model="selectedColumn"
              style="width:45%"
              size="small">
              <el-option
                v-for="column in columns"
                :key="column.prop"
                :label="column.label"
                :value="column.prop">
              </el-option>
            </el-select>
            <el-select
              v-if="selectedColumn === 'ROLE' || selectedColumn === 'HEALTH_STATE' || selectedColumn === 'GAME_STATE'"
              v-model="searchQuery">
              <el-option
                v-for="option in getOptions(selectedColumn)"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            <el-input
              v-else
              placeholder="输入关键字搜索"
              v-model="searchQuery"/>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleClick(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 使用开关组件来控制修改阵容 -->
    <!-- Edit Lineup Dialog -->
    <el-dialog
      title="点击卡片修改阵容"
      :visible.sync="editLineupDialogVisible"
      width="50%">
      <el-form :model="editLineupForm" :rules="editFormRules" ref="editFormRef">
        <div class="grid-container">
          <div v-for="(player, index) in lineupDetail" :key="index" class="player-card">
            <el-card @click.native="openEditDrawer(player)">
              <div slot="header" class="clearfix">
                <span>{{ player.PLAYER_NAME }}</span>
              </div>
              <div>
                <p>Position: {{ player.ROLE }}</p>
              </div>
            </el-card>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLineupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </span>
    </el-dialog>

    <!-- Edit lineup drawer -->
    <el-drawer
      title="Edit Player"
      :visible.sync="editPlayerDrawerVisible"
      direction="rtl"
      size="30%">
      <!-- Drawer content goes here -->
      <p>test</p>
    </el-drawer>

    <!--  -->
    <!--  -->
    <!--  -->
    <el-button class="test_button" @click="testRoute">this is test</el-button>  
    
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'LineupDetail',
  data () {
    return {
      loading: true,
      lineupDetail: [],
      // search
      searchQuery: '',
      selectedColumn: '',
      columns: [
        { prop: 'PLAYER_NAME', label: '姓名' },
        { prop: 'ROLE', label: '位置' },
        { prop: 'HEALTH_STATE', label: '健康状态' },
        { prop: 'GAME_STATE', label: '比赛状态' },
      ],
      //edit
      editLineupDialogVisible: false,
      editPlayerDrawerVisible: false,
      selectedPlayer: {},
      editLineupForm: {
        name: '',
        description: ''
      }
    }
  },
  watch: {
    selectedColumn() {
      this.searchQuery = '';
    }
  },
  created () {
    this.selectedColumn = this.columns[0].prop;
    const lineupid = this.$route.params.lineupId
    this.fetchLineupDetail(lineupid)
  },
  computed: {
    filteredLineupData () {
      if (!this.selectedColumn) {
        return this.lineupDetail;
      }
      return this.lineupDetail.filter(item => {
        return String(item[this.selectedColumn]).toLowerCase().includes(String(this.searchQuery).toLowerCase());
      });
    }
  },
  methods: {
    fetchLineupDetail (lineupid) {
      this.loading = true;
      //console.log(`/api/v1/player/displayall?lineupid=${lineupid}`);
      axios.get(`/api/v1/player/displayall?lineupid=${lineupid}`)
        .then(response => {
          this.lineupDetail = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
        })
    },
    handleClick (row) {
      this.$router.push(`/player-display/${row.PLAYER_ID}`);
    },
    goback () {
      window.sessionStorage.clear();
      this.$router.go(-1);
    },
    handleEdit () {
      this.editLineupDialogVisible = true;
    },
    openEditDrawer(player) {
      this.selectedPlayer = player;
      this.editPlayerDrawerVisible = true;
    },
    saveEdit () {
      this.editLineupDialogVisible = false;
    },
    getOptions(selectedColumn) {
      switch (selectedColumn) {
        case 'ROLE':
          return [
            { value: 'GK', label: '门将(GK)' },
            { value: 'B', label: '后卫(B)' },
            { value: 'M', label: '中场(M)' },
            { value: 'F', label: '前锋(F)' },
          ];
        case 'HEALTH_STATE':
          return [
            { value: 0, label: '健康' },
            { value: 1, label: '受伤' },
          ];
        case 'GAME_STATE':
          return [
            { value: 1, label: '允许出场' },
            { value: 0, label: '禁赛' },
          ];
        default:
          return [];
      }
    },

    ///////////////////////////////////////////
    ///////////////////////////////////////////
    testRoute() {
      this.$router.push(`/lineup/111111111`);
    },
  },
};
</script>
  
<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.button-contanier {
  display: flex;
  justify-content: flex-end;
}
.el-input-group {
  display: flex;
  align-items: center;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.player-card {
  width: 100%;
  height: 150px;
}

/*  */
/*  */
/*  */
.test_button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 100px; /* 设置按钮宽度 */
    height: 40px; /* 设置按钮高度 */
  }
</style>