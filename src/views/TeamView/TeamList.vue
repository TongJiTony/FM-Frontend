<template>
    <div>
      <p v-if="loading">
         <el-container>
      <el-header>
              <h1>Team List</h1>
      </el-header>
        <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"></el-table>
        </el-container>
      </p>
      <div v-else>
        <el-container>
      <el-header >
              <h1>Team List</h1>
      </el-header>
      
      <el-main>
          <el-table
    :data="team.filter(data => !search || data.TEAM_NAME.includes(search))"
    style="width: 100%">
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

           <el-table-column
       fixed="right" width="250">
       <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          placeholder="输入球队名称搜索"/>
        </template>
      <template slot-scope="scope">
        <el-button @click="handleDetails(scope.row)" type="text" size="small">Details</el-button>
        <el-button
          @click="handleEdit( scope.row)" type="text" size="small">Edit</el-button>
        <el-button
          @click="handleDelete(scope.row)" type="text" size="small">Delete</el-button>
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
          team: []
        
      };
    },
    created() {
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
    methods:{
      handleDetails(key){
        if (this.$route.path !== key){
        this.$router.push('teampage');
      }

      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    },
    sendRequest(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/v1/team/displayall', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('操作成功');
        } else {
            console.log('操作失败');
        }
    };
    xhr.send(JSON.stringify(data));
}
  };
  </script>

  <style>

</style>
