<template>
    <div>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <el-container>
      <el-header style="text-align: left; font-size: 18px">
              <h1>Team List</h1>
      </el-header>
      
      <el-main>
        <el-table :data="team">
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
        <template slot="header">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入球队名称搜索"/>
        </template>
      <template slot-scope="scope">
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
        loading: true,
        team:[]
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