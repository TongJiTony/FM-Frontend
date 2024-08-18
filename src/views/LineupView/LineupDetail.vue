<template>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <el-header style="font-size: 20px; display: flex; justify-content: space-between; align-items: center;"
    >阵容 ID: {{ this.lineupId }}
      <div class="button-contanier">
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
      style="width: 100%"
      fit>
      <el-table-column
        type="index"/>
      <el-table-column
        prop="PLAYER_ID"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        label="位置">
        <template slot-scope="scope">
          <el-tag round="true"> {{ scope.row.ROLE }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="HEALTH_STATE"
        label="健康状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.HEALTH_STATE === 0 ? 'success' : 'danger'">
            {{ scope.row.HEALTH_STATE === 0 ? '健康' : '受伤' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="GAME_STATE"
        label="比赛状态">
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
          <el-button size="small" @click="handleClick(scope.row)">详情</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">更换队员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Edit lineup drawer -->
    <el-drawer
      title="选择一个球员"
      :visible.sync="editPlayerDrawerVisible"
      direction="rtl"
      size="50%"
      >
      <!-- :before-close="handleBeforeClose" -->
      <div v-if="players.length === 0" class="loading">暂未查询到球员信息...</div>
      <div v-else class="player-container">
        <el-card
          v-for="player in players"
          :key="player.PLAYER_ID"
          :class="{ 
            'inlineup': isInlineup(player),
            'selected': isSelected(player) && isInlineup(player)
            }"
          @click.native="toggleSelectPlayer(player)"
          class="player-card">
          <div class="player-name">{{ player.PLAYER_NAME }}</div>
          <div class="player-position">{{ player.ROLE }}</div>
        </el-card>
      </div>
    </el-drawer>

    <!--  -->
    <!--  -->
    <!-- <el-button class="test_button" @click="testRoute">this is test</el-button> -->
    
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'LineupDetail',
  data () {
    return {
      loading: true,
      lineupId: this.$route.params.lineupId,
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
      // edit
      editPlayerDrawerVisible: false,
      players: [],
      editindex: -1,
    }
  },
  watch: {
    selectedColumn() {
      this.searchQuery = '';
    }
  },
  created () {
    this.selectedColumn = this.columns[0].prop;
    this.fetchLineupDetail(this.lineupId)
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
    // edit lineup
    handleEdit (row) {
      this.editindex = this.lineupDetail.indexOf(row);
      this.editPlayerDrawerVisible = true;
      this.fetchplayers();
    },
    fetchplayers () {
      let teamid = '';
      if (this.lineupDetail.length > 0) {
        teamid = this.lineupDetail[0].TEAM_ID;
      }
      axios.get(`/api/v1/player/displayall?teamid=${teamid}`)
        .then(response => {
          this.players = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 控制选择列表
    isInlineup (player) {
      return this.lineupDetail.some(item => item.PLAYER_ID === player.PLAYER_ID);
    },
    isSelected (player) {
      return this.lineupDetail[this.editindex].PLAYER_ID === player.PLAYER_ID;
    },
    toggleSelectPlayer(player) {
      //console.log("toggleSelectPlayer: ", player);
      console.log("playerID: ", player.PLAYER_ID);
    
      const index = this.lineupDetail.findIndex(p => p.PLAYER_ID === player.PLAYER_ID);
      console.log("index: ", index);

      if (index === -1) {
        this.lineupDetail.splice(this.editindex, 1, player);
        this.saveEditlinup(player);
      }
    },
    saveEditlinup (player) {
      console.log("lineupid: ", this.lineupId);
      
      const data = {};
      data[`PLAYER${this.editindex + 1}_ID`] = player.PLAYER_ID;
      console.log("data: ", data);
      axios.post(`/api/v1/lineup/update?lineupid=${this.lineupId}`, data)
        .then(response => {
          console.log(response.data);
          this.$message.success('修改成功');
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 设置标签
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

    /////////////////////////////////////////
    testRoute() {
      //this.$router.push(`/lineup/111111111`);
      this.$router.push(`/training/1000000002`);
    },
  },
};
</script>
  
<style scoped>
  .button-contanier {
    margin-left: auto;
  }
  .el-input-group {
    display: flex;
    align-items: center;
  }
  .player-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* 间距 */
  }
  .player-card {
    flex: 0 0 calc(30% - 20px); /* 宽度计算 */
    max-width: calc(33.333% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 60px;
    cursor: pointer;
  }
  .player-name {
    font-weight: bold;
  }

  .player-position {
    color: #666;
  }
  .el-card.inlineup {
    border: 2px solid #409EFF;
    background-color: #74756c89;
    cursor: default;
  }
  .el-card.selected {
    border: 2px solid #409EFF;
    background-color: #67C23A;
  }

/*  *//*  *//*  */
/*  *//*  *//*  */
/*  */  .test_button {
/*  */      position: absolute;
/*  */      bottom: 20px;
/*  */      left: 20px;
/*  */      width: 100px;
/*  */      height: 40px;
/*  */    }
</style>