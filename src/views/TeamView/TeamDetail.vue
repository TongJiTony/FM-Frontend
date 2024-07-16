<template>
   <div>
    <h1></h1>
    <p v-if="loading">Loading team data...</p>
    <div v-else>
      <div v-if="team">
        <el-tabs :tab-position="tabPosition" style="height: 500px;">
          <el-tab-pane label="球队简介">
            <el-container>
              <el-main>
                <el-descriptions>
                  <el-descriptions-item label="球队ID">{{team[0].TEAM_ID}}</el-descriptions-item>
                  <el-descriptions-item label="球队名称">{{team[0].TEAM_NAME}}</el-descriptions-item>
                  <el-descriptions-item label="成立时间">{{team[0].ESTABLISHED_DATE}}</el-descriptions-item>
                  <el-descriptions-item label="主教练">{{team[0].HEAD_COACH}}</el-descriptions-item>
                  <el-descriptions-item label="城市">{{team[0].CITY}}</el-descriptions-item>
                </el-descriptions>
              </el-main>    
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="球员信息"></el-tab-pane>
          
          <el-tab-pane label="财务表"></el-tab-pane>
        </el-tabs>   
      </div>
      <div v-else>
        <p>No team data available.</p>
      </div>
    </div>
  </div>
       
        
  </template>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        loading:true,
        team: null,
        tabPosition: "left"
      };
    },
    created() {
      this.fetchTeamDetail();
    },
    methods: {
      fetchTeamDetail() {
        const teamID = this.$route.params.teamID;
        console.log('Fetching data for team ID:', teamID);
        axios.get(`/api/v1/team/displayone?Teamid=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.team = response.data;
            this.loading = false;
          })
          .catch(error => {
            console.error('Failed to fetch team data:', error);
            this.loading = false;
          });
      }
    }
  };
  </script>

  <style>
  </style>