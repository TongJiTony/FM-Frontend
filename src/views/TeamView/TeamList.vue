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
          <el-table-column prop="TEAM_ID" label="ID" width="250">
          </el-table-column>
          <el-table-column prop="TEAM_NAME" label="球队名称" width="250">
          </el-table-column>
          <el-table-column prop="ESTABLISHED_DATE" label="成立时间" width="250">
          </el-table-column>
          <el-table-column prop="HEAD_COACH" label="主教练" width="250">
          </el-table-column>
          <el-table-column prop="CITY" label="城市" >
          </el-table-column>

           <el-table-column
      align="right">
       <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          placeholder="输入球队名称搜索"/>
        </template>
      <template slot-scope="scope">
         <el-button
          size="mini"
          @click="handleSearch(scope.$index, scope.row)">Details</el-button>
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
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
      axios.get('/api/v1/team/all')
        .then(response => {
          this.team = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
        });
    }
  };
  </script>

  <style>

</style>
