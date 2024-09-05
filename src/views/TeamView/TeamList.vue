<template>
    <div>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <el-card>
          <el-row>
            <el-col :span="18">
              <el-button type="primary"  @click="formTeam" >组建球队</el-button>      
            </el-col>
            <el-col :span="6">
              <el-input v-model="search" placeholder="输入球队名称搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
          </el-row>
      
      <el-col :span="24" style="height: 12px;"></el-col> 
          <el-row>
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
                  <el-button @click="handleDetails(scope.row)" type="text" size="small" >详情</el-button>
                  <el-button @click="handleEdit( scope.row)" type="text" size="small"  style="color: blue">编辑</el-button>
                  <el-button @click="handleDelete(scope.row)" type="text" size="small"  style="color: red">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
            
            
       
        </el-card>
        <el-dialog
      title="添加球队信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="球队名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="主教练" :label-width="formLabelWidth">
          <el-input v-model="addForm.HEAD_COACH"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.ESTABLISHED_DATE"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="addForm.CITY"></el-input>
        </el-form-item>
        <el-form-item label="球队队徽：" prop="TEAM_ICON">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :action="uploadAction"
            :http-request="customUpload"
            :show-file-list="true"
          >
            <img v-if="addForm.icon" :src="addForm.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon">上传球队队徽</i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddMedical">添加</el-button>
      </span>
    </el-dialog>
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
        addDialogVisible: false,

        addForm: {
        TEAM_NAME: "",
        ESTABLISHED_DATE: "",
        HEAD_COACH: "",
        CITY: "",
        TEAM_ICON: "",
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
        this.addDialogVisible=true;
      },
      handleAddDialogClose() {
      this.addDialogVisible = false;
    },

    },
  };
  </script>

<style scoped>

</style>
