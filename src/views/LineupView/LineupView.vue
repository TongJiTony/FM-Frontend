<template>
  <div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <el-container class="home-container">
        <!--头部  -->
        <el-header>阵容表
          <div class="button-contanier">
            <el-button
              type="primary"
              @click="handleAdd"
              class="add_button"
            >添加阵容</el-button>

            <el-button
              type="info"
              @click="goback"
              class="goback_button"
            >返回上级页面</el-button>
          </div>
        </el-header>

        <!-- 页面主体 -->
        <el-container>
          <el-main>
            <el-table
              :data="filteredLineupData"
              stripe
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="100"
              />
              <el-table-column
                prop="TEAM_NAME"
                label="球队"
                :width="300"
              >
              </el-table-column>
              <el-table-column
                prop="LINEUP_ID"
                label="阵容ID"
                :width="350"
              >
              </el-table-column>
              <el-table-column
                prop="NOTE"
                label="备注"
                :width="320"
              >
              </el-table-column>
              <el-table-column
                :width="300"
                align="right"
              >
                <template #header>
                  <div class='el-input-group'>
                    <el-select
                      v-model="selectedColumn"
                      placeholder="选择列"
                      style="width:45%"
                      size="small"
                    >
                      <el-option
                        v-for="column in columns"
                        :key="column.prop"
                        :label="column.label"
                        :value="column.prop"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      placeholder="输入关键字搜索"
                      v-model="searchQuery"
                    />
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleDetails(scope.row)"
                  >详情</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                  >编辑备注</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>

        <!-- edit note dialog -->
        <el-dialog
          title="修改阵容"
          :visible.sync="editDialogVisible"
        >
          <el-form :model="editForm">
            <el-form-item label="备注">
              <el-input v-model="editForm.NOTE"></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="saveEdit"
            >确认</el-button>
          </div>
        </el-dialog>

        <!-- add lineup dialog -->
        <el-dialog
          title="增加阵容"
          :visible.sync="addDialogVisible"
          width=1000px
        >
          <el-card
            class="add-teamID-card"
            @click.native="openAddDrawer_teamID()"
          >
            <div v-if="addForm.TEAM_ID">
              <p>球队 ID: {{ addForm.TEAM_ID }}</p>
              <!-- <p>球队名:  {{ get_TEAM_NAME(addForm.TEAM_ID) }}</p> -->
            </div>
            <div v-else>
              <p style="font-weight: bold; color: brown;">请先点击确定一个球队</p>
            </div>
          </el-card>

          <div v-if="players.length > 0">
            <p class="add-lineup-title">球员列表:</p>
            <div class="player-cards">
              <el-card
                v-for="player in players"
                :key="player.PLAYER_ID"
                :class="{'selected': isSelected(player)}"
                @click.native="toggleSelectPlayer(player)"
                style="cursor: pointer;"
                class="player-card"
              >
                <p>
                  <span>{{ player.PLAYER_NAME }}</span>
                  <span class="separator"></span>
                  <span>{{ player.ROLE }}</span>
                </p>
              </el-card>
            </div>

            <!-- 编辑NOTE的输入框 -->
            <el-input
              type="textarea"
              placeholder="请输入阵容备注"
              v-model="addForm.NOTE"
              maxlength="200"
              show-word-limit
              style="margin-top: 20px;"
            >
            </el-input>
          </div>
          <div v-else>
            <p class="add-lineup-title">球员列表:</p>
            <p class="no-players">暂无球员</p>
          </div>

          <div slot="footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="saveAdd"
            >确认</el-button>
          </div>
        </el-dialog>

        <!-- add lineup drawer --select teamID -->
        <el-drawer
          title="选择一个球队"
          :visible.sync="addDrawerVisible_teamID"
          direction="rtl"
          size="30%"
        >
          <el-row :gutter="20">
            <el-col
              :span="24"
              v-for="team in teams"
              :key="team.TEAM_ID"
            >
              <el-card
                @click.native="selectTeam(team)"
                style="cursor: pointer;"
              >
                <p>{{ team.TEAM_NAME }}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-drawer>

      </el-container>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'LineupView',
  data () {
    return {
      loading: true,
      lineupData: [],
      teamID: this.$route.params.teamID, //路由参数
      // search
      searchQuery: '',
      selectedColumn: '',
      columns: [
        { prop: 'TEAM_NAME', label: '球队' },
        { prop: 'LINEUP_ID', label: '阵容ID' },
        { prop: 'NOTE', label: '备注' },
      ],
      // edit
      editDialogVisible: false,
      editForm: {
        NOTE: '',
      },
      editIndex: -1,
      // add
      addForm: {
        NOTE: '',
        TEAM_ID: 0,
      },
      addDialogVisible: false,
      addDrawerVisible_teamID: false,
      teams: [],
      players: [],
      selectedPlayers: [],
    };
  },
  created () {
    this.fetchLineups();
    this.selectedColumn = this.columns[0].prop;
    this.addForm.TEAM_ID = this.teamID;
  },
  watch: {
    'addForm.TEAM_ID': function (newVal) {
      if (newVal) {
        this.fetchPlayersByTeamId(newVal);
      }
    },
  },
  computed: {
    filteredLineupData () {
      if (!this.selectedColumn) {
        return this.lineupData;
      }
      return this.lineupData.filter(item => {
        return String(item[this.selectedColumn]).toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    fetchLineups () {
      this.loading = true;
      //console.log("teamID: ", this.teamID);

      let apiUrl = '/api/v1/lineup/displayall';
      if (this.teamID) {
        apiUrl = `/api/v1/lineup/displayall?teamid=${this.teamID}`;
      }
      axios.get(apiUrl)
        .then((response) => {
          this.lineupData = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    // Add new lineup
    handleAdd () {
      this.addDialogVisible = true;
    },
    openAddDrawer_teamID () {
      if (!this.teamID) {
        this.addDrawerVisible_teamID = true;
        this.fetchTeams();
      }
    },
    fetchTeams () {
      // 这里使用了伪代码来表示API调用，实际应根据API具体情况进行调整
      axios.get('/api/v1/team/displayall')
        .then(response => {
          this.teams = response.data;
        })
        .catch(error => {
          console.error('Error fetching teams:', error);
        });
    },
    selectTeam (team) {
      console.log("selected team: ", team);
      this.addForm.TEAM_ID = team.TEAM_ID;
      this.addDrawerVisible_teamID = false;
    },
    fetchPlayersByTeamId (teamId) {
      axios.get(`/api/v1/player/displayall?teamid=${teamId}`)
        .then(response => {

          this.players = response.data;
        }),
        error => {
          console.error('Error fetching players:', error);
        };
    },
    // 控制选择列表
    toggleSelectPlayer (player) {
      const index = this.selectedPlayers.findIndex(p => p.PLAYER_ID === player.PLAYER_ID);
      if (index > -1) {
        this.selectedPlayers.splice(index, 1);
      } else if (this.selectedPlayers.length === 11) {
        this.$message.error('只能选择11个球员');
      } else if (this.selectedPlayers.length < 11) {
        this.selectedPlayers.push(player);
      }
      //console.log("selectedPlayers: ", this.selectedPlayers);
    },
    isSelected (player) {
      return this.selectedPlayers.some(p => p.PLAYER_ID === player.PLAYER_ID);
    },
    // 保存添加的阵容
    saveAdd () {
      if (this.selectedPlayers.length !== 11) {
        this.$message.error('请选择11名球员');
        return;
      }
      const lineup = {
        NOTE: this.addForm.NOTE,
        TEAM_ID: Number(this.addForm.TEAM_ID),
        PLAYER1_ID: Number(this.selectedPlayers[0].PLAYER_ID),
        PLAYER2_ID: Number(this.selectedPlayers[1].PLAYER_ID),
        PLAYER3_ID: Number(this.selectedPlayers[2].PLAYER_ID),
        PLAYER4_ID: Number(this.selectedPlayers[3].PLAYER_ID),
        PLAYER5_ID: Number(this.selectedPlayers[4].PLAYER_ID),
        PLAYER6_ID: Number(this.selectedPlayers[5].PLAYER_ID),
        PLAYER7_ID: Number(this.selectedPlayers[6].PLAYER_ID),
        PLAYER8_ID: Number(this.selectedPlayers[7].PLAYER_ID),
        PLAYER9_ID: Number(this.selectedPlayers[8].PLAYER_ID),
        PLAYER10_ID: Number(this.selectedPlayers[9].PLAYER_ID),
        PLAYER11_ID: Number(this.selectedPlayers[10].PLAYER_ID),
      };
      console.log("lineup:", lineup);

      axios.post('/api/v1/lineup/add', lineup)
        .then(response => {
          if (response.status === 201) {
            this.$message({
              message: '添加成功',
              type: 'success',
            });
            this.addDialogVisible = false;
            this.fetchLineups();   //there may be more effective way to do this
            //this.$set(this.lineupData, this.lineupData.length, lineup);
          }
        })
        .catch(error => {
          console.error('Error adding lineup:', error);
          this.$message.error('添加失败');
        });
    },


    // 返回上级页面
    goback () {
      window.sessionStorage.clear();
      this.$router.go(-1);
    },
    handleDetails (row) {
      console.log("target: ", `/lineupDetail/${row.LINEUP_ID}`);
      this.$router.push(`/lineupDetail/${row.LINEUP_ID}`);
    },
    handleDelete (index, row) {
      this.$confirm('确定删除该行数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/v1/lineup/delete?lineupid=${row.LINEUP_ID}`)
          .then(response => {
            if (response.status === 204) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.lineupData.splice(index, 1);
            }
          })
          .catch(error => {
            console.error('Error deleting lineup:', error);
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleEdit (index, row) {
      //console.log(index);
      this.editForm = { ...row };
      this.editIndex = index;
      this.editDialogVisible = true;
    },
    saveEdit () {
      if (this.editIndex !== -1) {
        // 使用Object.keys和filter方法删除TEAM_NAME属性，并将LINEUP_ID转换为字符串
        const formData = Object.keys(this.editForm).filter(key => key !== 'TEAM_NAME').reduce((obj, key) => {
          if (key === 'LINEUP_ID') {
            obj[key] = this.editForm[key].toString();
          } else {
            obj[key] = this.editForm[key];
          }
          return obj;
        }, {});
        //console.log("formData: ", formData);

        axios.post(`/api/v1/lineup/update?lineupid=${this.editForm.LINEUP_ID}`, formData)
          .then(response => {
            if (response.status === 204) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
            }
          })
          .catch(error => {
            this.$message.error('修改失败', error);
          });

        this.$set(this.lineupData, this.editIndex, { ...this.editForm });
        this.editIndex = -1;
        this.editDialogVisible = false;
      }
    },
    // assist
    get_TEAM_NAME (team_id) {
      console.log("team_id: ", team_id);
      axios.get(`/apiv1/team/displayone?Teamid=${team_id}`)
        .then(response => {
          const teamData = response.data;
          console.log("teamData: ", teamData);
          return teamData.TEAM_NAME;
        })
        .catch(error => {
          console.error('Error fetching team data:', error);
          return '';
        });
    },
  }
};
</script>


<style scoped>
.home-container {
  height: 100%;
}
.add-teamID-card {
  width: 300px;
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
}
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

.player-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 控制卡片之间的间距 */
}
.player-card {
  flex: 1 1 calc(25% - 10px); /* 每行放置4个卡片，并减去间距 */
  max-width: calc(25% - 10px); /* 确保最大宽度不超过25% */
  box-sizing: border-box; /* 确保padding和border不会影响宽度 */
}
.el-card.selected {
  border: 2px solid #409eff;
}
.add-lineup-title {
  margin-top: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}
.separator {
  width: 9px;
  height: 100%;
  background-color: #ccc;
  margin: 0 10px;
}
</style>