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


    },
  };
  </script>

<style scoped>

</style>
