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
        <!-- 侧栏 -->
         
        <!-- 页面主体区 -->
        <el-container>
          <el-main>
            <el-table
            :data = "lineupData"
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
              :width="400">
            </el-table-column>
            <el-table-column
              prop="NOTE"
              label="备注"
              :width="320">
            </el-table-column>
            <el-table-column
              :width="250"
              align="right">
              <template #header>
                <el-input size="small" placeholder="Type to search" />
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

        <!-- 修改对话框 -->
        <el-dialog title="修改阵容" :visible.sync="editDialogVisible">
          <el-form :model="editForm">
            <!-- <el-form-item label="阵容ID">
              <el-input v-model="editForm.LINEUP_ID" :placeholder = "editLINEUP_ID"></el-input>
            </el-form-item> -->
            <el-form-item label="备注">
              <el-input v-model="editForm.NOTE"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">确认</el-button>
          </div>
        </el-dialog>
        
        <!-- 添加对话框 -->
        <el-dialog title="增加阵容" :visible.sync="addDialogVisible" width = 800px>
          <el-form :model="addForm">
            <el-row>
              <el-col :span="7" class = "input-col">
                <el-form-item label="球队ID">
                  <el-input v-model="addForm.TEAM_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员1 ID">
                  <el-input v-model="addForm.PLAYER1_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员4 ID">
                  <el-input v-model="addForm.PLAYER4_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员7 ID">
                  <el-input v-model="addForm.PLAYER7_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员10 ID">
                  <el-input v-model="addForm.PLAYER10_ID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" class = "input-col">
                <el-form-item label="备注">
                  <el-input v-model="addForm.NOTE"></el-input>
                </el-form-item>
                <el-form-item label="球员2 ID">
                  <el-input v-model="addForm.PLAYER2_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员5 ID">
                  <el-input v-model="addForm.PLAYER5_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员8 ID">
                  <el-input v-model="addForm.PLAYER8_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员11 ID">
                  <el-input v-model="addForm.PLAYER11_ID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" class = "input-col">
                <el-form-item label="球员3 ID">
                  <el-input v-model="addForm.PLAYER3_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员6 ID">
                  <el-input v-model="addForm.PLAYER6_ID"></el-input>
                </el-form-item>
                <el-form-item label="球员9 ID">
                  <el-input v-model="addForm.PLAYER9_ID"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="8">
              </el-col>
            </el-row> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveAdd">确认</el-button>
          </div>
        </el-dialog>
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
      editDialogVisible: false,
      editForm: {
        NOTE: '',
      },
      editIndex: -1,
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
        PLAYER11_ID: 0
      },
      addDialogVisible: false,
    };
  },
  created() {
    this.fetchLineups();
  },

  methods: {
    fetchLineups() {
      this.loading = true;
      axios.get('/api/v1/lineup/displayall')
        .then((response) => {
          this.lineupData = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    handleAdd() {
      this.addDialogVisible = true;
    },
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
      console.log("target: ", `/lineup/${row.LINEUP_ID}`);
      this.$router.push(`/lineup/${row.LINEUP_ID}`);
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
        //console.log("editForm", this.editForm);
        // 使用Object.keys和filter方法删除TEAM_NAME属性，并将LINEUP_ID转换为字符串
        const formData = Object.keys(this.editForm).filter(key => key !== 'TEAM_NAME').reduce((obj, key) => {
          if (key === 'LINEUP_ID') {
            obj[key] = this.editForm[key].toString();
          } else {
            obj[key] = this.editForm[key];
          }
          return obj;
        }, {});
        console.log("formData: ", formData);

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
          this.$message.error('Failed to update lineup', error);
        });
        
        this.$set(this.lineupData, this.editIndex, { ...this.editForm });
        this.editIndex = -1;
        this.editDialogVisible = false;
      }
    },
  },
};
</script>



<style scoped>
  .home-container{
    height: 100%;
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
  .note-box {
    width: 100%;
    height: 50px; /* 设置展示框的高度 */
    background-color: #f0f0f0; /* 设置展示框的背景颜色 */
    text-align: center; /* 居中对齐内容 */
    line-height: 50px; /* 设置行高，使内容垂直居中 */
    text-indent: -900px;
    /* padding-left: 200px; */
  }
  .input-col {
    margin-right: 20px;
  }
</style>