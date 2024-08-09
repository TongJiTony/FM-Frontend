<template>
    <div>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <el-container>
          <el-main>
           
      <el-col :span="18">
        <el-button type="primary"  @click="formTeam" >组建球队</el-button>
        
    <!-- Add Player Dialog -->
    <el-dialog
      title="组建球队"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="球队名称" :label-width="formLabelWidth" prop="TEAM_NAME">
          <el-input v-model="addForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" :label-width="formLabelWidth" prop="ESTABLISHED_DATE">
          <el-date-picker v-model="addForm.ESTABLISHED_DATE" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="球队ID" :label-width="formLabelWidth" prop="TEAM_ID">
          <el-input v-model="addForm.TEAM_ID" type="number"></el-input>
        </el-form-item>
        <el-form-item label="主教练" :label-width="formLabelWidth" prop="HEAD_COACH">
          <el-input v-model="addForm.HEAD_COACH"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="CITY">
          <el-input v-model="addForm.CITY"></el-input>
        </el-form-item>     
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddTeam">添加</el-button>
      </span>
    </el-dialog>

      </el-col>
      <el-col :span="6">
        <el-input v-model="search" placeholder="输入球队名称搜索" clearable>
           <i slot="prefix" class="el-input__icon el-icon-search"></i>
           </el-input>
      </el-col>

           
          
            <el-table :data="team.filter(data => !search || data.TEAM_NAME.includes(search))" style="width: 100%">
              <el-table-column prop="TEAM_ID" label="ID" width="200">
              </el-table-column>
              <el-table-column prop="TEAM_NAME" label="球队名称" width="200">
              </el-table-column>
              <el-table-column prop="ESTABLISHED_DATE" label="成立时间" width="250">
              </el-table-column>
              <el-table-column prop="HEAD_COACH" label="主教练" width="200">
              </el-table-column>
              <el-table-column prop="CITY" label="城市"  >
              </el-table-column>
             
              <el-table-column fixed="right" width="250">
                <!-- eslint-disable-next-line -->
            
                <template slot-scope="scope">
                  <el-button @click="handleDetails(scope.row)" type="text" size="small">Details</el-button>
                  <el-button @click="handleEdit( scope.row)" type="text" size="small">Edit</el-button>
                  <el-button @click="handleDelete(scope.row)" type="text" size="small">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>    
        </el-container>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        search: '',
        loading: true,
        team: [],
      formLabelWidth: '100px',
      addDialogVisible: false,
      addForm: {
        TEAM_NAME: '',
        ESTABLISHED_DATE:'',
        TEAM_ID:'',    
        HEAD_COACH:'',
        CITY:'',
      },
      addFormRules: {
        TEAM_NAME: [{ required: true, message: '请输入球队名称', trigger: 'blur' }],
        ESTABLISHED_DATE: [{ required: true, message: '请选择成立时间', trigger: 'blur' }],
        TEAM_ID: [{ required: true, message: '请输入队伍ID', trigger: 'blur' }],
        HEAD_COACH: [{ required: true, message: '请输入主教练', trigger: 'blur' }],
        CITY: [{ required: true, message: '请输入城市', trigger: 'blur' }],
      },
      };
    },
    created() {
      this.refresh();
    },
    
    methods:{
      refresh(){
        axios.get('/api/v1/team/displayall')
          .then(response => {
            this.team = response.data;
            this.loading = false;
          })
          .catch(error => {
            console.error(error);
            this.loading = false;
          });
      },
      handleDetails(row){
        console.log(row.TEAM_ID);
        this.$router.push(`/teamdetail/${row.TEAM_ID}`); 

      },
      handleEdit( row) {
        console.log(row.TEAM_ID);
      },
      handleDelete(row) {
        console.log(row.TEAM_ID);
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(`/api/v1/team/delete?Teamid=${row.TEAM_ID}`)
          .then(response=>{
            if (response.status ==200){
              this.sendMessage('success','删除成功!');
              this.refresh();
            }
          })
        }).catch(() => {
          this.sendMessage('info','已取消删除')          
        });  
      },
      sendMessage(Type, Message) {
        this.$message({
          type: Type,
          message: Message,
        });
      },

      formTeam(){      
      console.log('Opening add team dialog');
      this.addDialogVisible = true;    
      },

      handleAddDialogClose() {
      console.log('Closing add team dialog');
      this.addDialogVisible = false;
    },

    handleAddTeam() {
    console.log('Adding new team');
    this.$refs.addFormRef.validate((valid) => {
    if (valid) {
      // Construct the JSON object as per server's expectations
      const newTeamData = {
        TEAM_NAME: this.addForm.TEAM_NAME,
        ESTABLISHED_DATE: this.addForm.ESTABLISHED_DATE,
        TEAM_ID: Number(this.addForm.TEAM_ID),
        HEAD_COACH: this.addForm.HEAD_COACH,
        CITY: this.addForm.CITY,
      };
      console.log(newTeamData);
      // Use the correct API endpoint
      axios.post('/api/v1/team/add', newTeamData)
        .then(() => {
          console.log('Team added successfully');
          this.refresh(); // 刷新玩家列表
          this.addDialogVisible = false; // 关闭对话框
        })
        .catch(error => {
          if (error.response) {
            // 服务器返回的错误响应
            console.error('Failed to add team:', error.response.data);
            this.sendMessage('error', 'Failed to add team: ' + error.response.data);
          } else if (error.request) {
            // 请求已发出，但没有收到响应
            console.error('No response received:', error.request);
            this.sendMessage('error', 'No response received');
          } else {
            // 设置请求时出错
            console.error('Error setting up request:', error.message);
            this.sendMessage('error', 'Error setting up request: ' + error.message);
          }
        });
    }
  });
},
    },
  };
  </script>

<style scoped>

</style>
