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
          <el-tab-pane label="球员信息">
            <el-container>
              <el-main>
                <el-input v-model="search" placeholder="输入球员姓名搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-table :data="player.filter(data => !search || data.PLAYER_NAME.includes(search))" style="width: 100%">
                  <el-table-column prop="PLAYER_ID" label="球员ID" width="150">
                  </el-table-column>
                  <el-table-column prop="PLAYER_NAME" label="球员姓名" width="150">
                  </el-table-column>
                  <el-table-column prop="BIRTHDAY" label="出生日期" width="150">
                  </el-table-column>
                  <el-table-column prop="ROLE" label="战术角色" width="150">
                  </el-table-column>
                  <el-table-column prop="USED_FOOT" label="惯用脚" width="150" >
                  </el-table-column>
                  <el-table-column prop="HEALTH_STATE" label="健康状态" width="150" >
                  </el-table-column>
                  <el-table-column prop="RANK" label="技术评价" width="150" >
                  </el-table-column>
                  <el-table-column prop="GAME_STATE" label="上场状态"  width="150">
                  </el-table-column>
                  <el-table-column prop="TRANS_STATE" label="转会状态"  >
                  </el-table-column>
                </el-table>
              </el-main>    
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="财务表">
          </el-tab-pane>

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
        player:[],
        tabPosition: "left",
        search:""
      };
    },
    created() {
      this.fetchTeamDetail()
    },
    methods: {
      fetchTeamDetail() {
        const teamID = this.$route.params.teamID;
        console.log('Fetching data for team ID:', teamID);
        axios.get(`/api/v1/team/displayone?Teamid=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.team = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch team data:', error);
          });
        axios.get(`/api/v1/player/displayall?teamid=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.player = response.data;
            this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch player data:',error);
          this.loading = false;
        })
      }
    }
  };
  </script>

  <style>
  </style>