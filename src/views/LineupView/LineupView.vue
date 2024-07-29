<template>
  <div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <el-container class="home-container">
        <!--头部  -->
        <el-header>阵容表
           <div class = "button-contanier">
            <el-button type="primary" @click="handleAdd" class = "add_button">添加阵容</el-button>

            <el-button type="info" @click="goback" class = "goback_button">返回上级页面</el-button>
          </div>
        </el-header>
        
        <!-- 页面主体 -->
        <el-container>
          <el-main>
            <el-table
            :data = "filteredLineupData"
            stripe
            style = "width: 100%">
            <el-table-column type="index" width="100" />
            <el-table-column
              prop="TEAM_NAME"
              label="球队"
              :width="300">
            </el-table-column>
            <el-table-column
              prop="LINEUP_ID"
              label="阵容ID"
              :width="350">
            </el-table-column>
            <el-table-column
              prop="NOTE"
              label="备注"
              :width="320">
            </el-table-column>
            <el-table-column
              :width="300"
              align="right">
              <template #header>
                <div class='el-input-group'>
                  <el-select v-model="selectedColumn" placeholder="选择列" style="width:45%" size="small">
                    <el-option
                      v-for="column in columns"
                      :key="column.prop"
                      :label="column.label"
                      :value="column.prop">
                    </el-option>
                  </el-select>
                  <el-input
                    placeholder="输入关键字搜索"
                    v-model="searchQuery"
                  />
                </div>
              </template>
              <template slot-scope="scope">
                <el-button size="small" @click="handleDetails(scope.row)">详情</el-button>
                <el-button size = "small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑备注</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
            </el-table>
          </el-main>
        </el-container>

        <!-- edit note dialog -->
        <el-dialog title="修改阵容" :visible.sync="editDialogVisible">
          <el-form :model="editForm">
            <el-form-item label="备注">
              <el-input v-model="editForm.NOTE"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">确认</el-button>
          </div>
        </el-dialog>

        <!-- add lineup dialog -->
        <el-dialog title="增加阵容" :visible.sync="addDialogVisible" width = 1000px>
          <el-card class="add-teamID-card" @click.native="openAddDrawer_teamID()">
            <div v-if="addForm.TEAM_ID">
              <p>球队 ID:  {{ addForm.TEAM_ID }}</p>
              <!-- <p>球队名:  {{ get_TEAM_NAME(addForm.TEAM_ID) }}</p> -->
            </div>
            <div v-else>
              <p>点击确定一个球队</p>
            </div>
          </el-card>

          <div slot="footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveAdd">确认</el-button>
          </div>
        </el-dialog>

        <!-- add lineup drawer --select teamID -->
        <el-drawer
          title="选择一个球队"
          :visible.sync="addDrawerVisible_teamID"
          direction="rtl"
          size="30%">
          <el-row :gutter="20">
            <el-col :span="24" v-for="team in teams" :key="team.TEAM_ID">
              <el-card @click.native="selectTeam(team)" style="cursor: pointer;">
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
  data() {
    return {
      loading: true,
      lineupData:[],
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
        PLAYER1_ID: 0,
        PLAYER2_ID: 0,
        PLAYER3_ID: 0,
        PLAYER4_ID: 0,
        PLAYER5_ID: 0,
        PLAYER6_ID: 0,
        PLAYER7_ID: 0,
        PLAYER8_ID: 0,
        PLAYER9_ID: 0,
        PLAYER10_ID: 0,
        PLAYER11_ID: 0,
      },
      addDialogVisible: false,
      addDrawerVisible_teamID: false,
      teams: [],
    };
  },
  created() {
    this.fetchLineups();
    this.selectedColumn = this.columns[0].prop;
    this.addForm.TEAM_ID = this.teamID;
  },
  computed: {
    filteredLineupData() {
      if (!this.selectedColumn) {
        return this.lineupData;
      }
      return this.lineupData.filter(item => {
        return String(item[this.selectedColumn]).toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    fetchLineups() {
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
    handleAdd() {
      this.addDialogVisible = true;
      //console.log("test: ", this.teamID);
    },
    openAddDrawer_teamID() {
      if (!this.teamID) {
        this.addDrawerVisible_teamID = true;
        this.fetchTeams();
      }
    },
    fetchTeams() {
      // 这里使用了伪代码来表示API调用，实际应根据API具体情况进行调整
      axios.get('/api/v1/team/displayall')
        .then(response => {
          this.teams = response.data;
        })
        .catch(error => {
          console.error('Error fetching teams:', error);
        });
    },
    selectTeam(team) {
      console.log("selected team: ", team);
      this.addForm.TEAM_ID = team.TEAM_ID;
      this.addDrawerVisible_teamID = false;
    },
    ///////////////////////////
    ///////////////////////////
    saveAdd() {
      console.log("addForm:", this.addForm);
      axios.post('/api/v1/lineup/add', {
        NOTE: this.addForm.NOTE,
        TEAM_ID: Number(this.addForm.TEAM_ID),
        PLAYER1_ID: Number(this.addForm.PLAYER1_ID),
        PLAYER2_ID: Number(this.addForm.PLAYER2_ID),
        PLAYER3_ID: Number(this.addForm.PLAYER3_ID),
        PLAYER4_ID: Number(this.addForm.PLAYER4_ID),
        PLAYER5_ID: Number(this.addForm.PLAYER5_ID),
        PLAYER6_ID: Number(this.addForm.PLAYER6_ID),
        PLAYER7_ID: Number(this.addForm.PLAYER7_ID),
        PLAYER8_ID: Number(this.addForm.PLAYER8_ID),
        PLAYER9_ID: Number(this.addForm.PLAYER9_ID),
        PLAYER10_ID: Number(this.addForm.PLAYER10_ID),
        PLAYER11_ID: Number(this.addForm.PLAYER11_ID)
      })
      .then(response => {
         if (response.status === 201) {
          this.$message({
            message: '添加成功',
            type: 'success',
          });
           this.addDialogVisible = false;
        }
      })
      .catch(error => {
        console.error('Error adding lineup:', error);
        this.$message.error('添加失败');
      });
    },
    goback() {
      window.sessionStorage.clear();
      this.$router.go(-1);
    },
    handleDetails(row) {
      console.log("target: ", `/lineupDetail/${row.LINEUP_ID}`);
      this.$router.push(`/lineupDetail/${row.LINEUP_ID}`);
    },
    handleDelete(index, row) {
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
    handleEdit(index, row) {
      //console.log(index);
      this.editForm = { ...row };
      this.editIndex = index;
      this.editDialogVisible = true;
    },
    saveEdit() {
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
    get_TEAM_NAME(team_id) {
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
  .home-container{
    height: 100%;
   }
  .add-teamID-card {
    width: 300px; /* 调整宽度 */
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
  }
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
  .el-input-group {
  display: flex;
  align-items: center;
}

</style>