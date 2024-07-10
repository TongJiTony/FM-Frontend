<template>
    <div>
      <h1>Team Page</h1>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>setting</span>
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