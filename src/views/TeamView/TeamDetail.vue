<template>
   <div>
    <h1></h1>
    <p v-if="loading">Loading team data...</p>
    <div v-else>
      <div v-if="team">
        <el-tabs :tab-position="tabPosition" style=" height: 500px;">
          <el-tab-pane label="球队简介">
            <el-container>
              <el-main>
                <el-row :gutter="10">
                  <el-col :span="6">
                    <div class="team-image">
                      <img src="https://img.51miz.com/Element/00/91/85/34/422e1064_E918534_f98a4621.png" alt="Team Image" />
                    </div>
                  </el-col>
                  <h2 style="font-size: 24px;">{{ team[0].TEAM_NAME }}</h2>
                  <el-col :span="18" class="team-info">
                   
                    <el-row :gutter="12">
                      <el-col :span="12">
                      <p>
                        <strong>队伍编号:</strong>
                        <el-tag>{{ team[0].TEAM_ID }}</el-tag>
                      </p>
                      </el-col>
                      <el-col :span="12">
                      <p>
                        <strong>主教练:</strong>
                        <el-tag>{{ team[0].HEAD_COACH }}</el-tag>
                      </p>
                      </el-col>
                      <el-col :span="12">
                      <p>
                        <strong>成立时间:</strong>
                        <el-tag>{{ team[0].ESTABLISHED_DATE }}</el-tag>
                      </p>
                      </el-col>
                      <el-col :span="12">
                      <p>
                        <strong>城市:</strong>
                        <el-tag>{{ team[0].CITY }}</el-tag>
                      </p>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
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
          <el-tab-pane label="财务记录">
            <el-container>
              <el-main>
                <el-input v-model="search" placeholder="输入球员姓名搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-table :data="record.filter(data => !search || data.RECORD_ID.includes(search))" style="width: 100%">
                  <el-table-column prop="RECORD_ID" label="财务记录ID" width="150">
                  </el-table-column>
                  <el-table-column prop="DESCRIPTION" label="交易描述" width="150">
                  </el-table-column>
                  <el-table-column prop="TRANSACTION_DATE" label="交易日期" width="200">
                  </el-table-column>
                  <el-table-column prop="AMOUNT" label="金额" width="150">
                  </el-table-column>            
                </el-table>
              </el-main>    
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="阵容信息">
  <el-container>
    <el-main>
      <el-input v-model="search" placeholder="输入搜索" clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-table :data="lineup.filter(data => !search || data.NOTE.includes(search))" style="width: 100%">
        <el-table-column prop="LINEUP_ID" label="阵容ID" width="150"></el-table-column>
         <el-table-column prop="PLAYER1_ID" label="球员1ID" width="150">
          <template #header>
            <span>球员1ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER1_ID)">{{ scope.row.PLAYER1_ID }}</el-button>
          </template>
        </el-table-column>
        <!-- 其他球员ID列的代码类似，这里省略 -->
        <el-table-column prop="PLAYER2_ID" label="球员2ID" width="150">
          <template #header>
            <span>球员2ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER2_ID)">{{ scope.row.PLAYER2_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER3_ID" label="球员3ID" width="150">
          <template #header>
            <span>球员3ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER3_ID)">{{ scope.row.PLAYER3_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER4_ID" label="球员4ID" width="150">
          <template #header>
            <span>球员4ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER4_ID)">{{ scope.row.PLAYER4_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER5_ID" label="球员5ID" width="150">
          <template #header>
            <span>球员5ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER5_ID)">{{ scope.row.PLAYER5_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER6_ID" label="球员6ID" width="150">
          <template #header>
            <span>球员6ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER6_ID)">{{ scope.row.PLAYER6_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER7_ID" label="球员7ID" width="150">
          <template #header>
            <span>球员7ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER7_ID)">{{ scope.row.PLAYER7_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER8_ID" label="球员8ID" width="150">
          <template #header>
            <span>球员8ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER8_ID)">{{ scope.row.PLAYER8_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER9_ID" label="球员9ID" width="150">
          <template #header>
            <span>球员9ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER9_ID)">{{ scope.row.PLAYER9_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER10_ID" label="球员10ID" width="150">
          <template #header>
            <span>球员10ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER10_ID)">{{ scope.row.PLAYER10_ID }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="PLAYER11_ID" label="球员11ID" width="150">
          <template #header>
            <span>球员11ID</span>
          </template>
          <template #default="scope">
           <el-button type="text" @click="drawer = true,fetchplayerdata(scope.row.PLAYER11_ID)">{{ scope.row.PLAYER11_ID }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
          </el-tab-pane>


           <el-tab-pane label="比赛信息">
            <el-container>
              <el-main>
                <el-input v-model="search" placeholder="输入搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-table :data="match.filter(data => !search || data.NOTE.includes(search))" style="width: 100%">
                  <el-table-column prop="MATCH_ID" label="比赛ID" width="150">
                  </el-table-column>
                  <el-table-column prop="MATCH_DATE" label="比赛日期" width="150">
                  </el-table-column>
                  <el-table-column prop="MATCH_STADIUM" label="比赛地点" width="150">
                  </el-table-column>
                  <el-table-column prop="HOME_TEAM_NAME" label="主场球队名称" width="150">
                  </el-table-column>
                  <el-table-column prop="AWAY_TEAM_NAME" label="客场球队名称" width="150" >
                  </el-table-column>
                  <el-table-column prop="HOME_TEAM_SCORE" label="主场得分" width="150" >
                  </el-table-column>
                  <el-table-column prop="AWAY_TEAM_SCORE" label="客场得分" width="150" >
                  </el-table-column>
                  <el-table-column prop="HOME_TEAM_ID" label="主场球队ID"  width="150">
                  </el-table-column>
                  <el-table-column prop="AWAY_TEAM_ID" label="客场球队ID" width="150" >
                  </el-table-column>
                </el-table>
              </el-main>    
            </el-container>
          </el-tab-pane>
           <el-tab-pane label="医疗信息"  >
            <el-container>
              <el-main>
                <el-input v-model="search" placeholder="输入搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-table :data="medical.filter(data => !search || data.NOTE.includes(search))" style="width: 100%">
                  <el-table-column prop="medical_id" label="医疗处理ID" width="150" >
                  </el-table-column>
                  <el-table-column prop="player_id" label="球员ID" width="150">
                  </el-table-column>
                  <el-table-column prop="hurt_part" label="损伤部位" width="150">
                  </el-table-column>
                  <el-table-column prop="hurt_time" label="受伤时间" width="150">
                  </el-table-column>
                  <el-table-column prop="medical_care" label="处理方法" width="150" >
                  </el-table-column>
                  <el-table-column prop="state" label="处理结果" width="150" >
                  </el-table-column>
                </el-table>
              </el-main>    
            </el-container>
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
        drawer: false,
        player1:[],
        loading:true,
        team: null,
        player: [],
        record:[],
        lineup: [],
        match: [],
        medical:[],
        tabPosition: "left",
        search:""
      };
    },
    created() {
      this.fetchTeamDetail()
    },
    methods: {
      fetchplayerdata(playerID1){
      axios.get(`/api/v1/player/displayone?playerid=${playerID1}`)
            .then(response => {
            console.log('Received playerdata:', response.data);
            this.player1 = response.data;
            this.loading = false;
            })
            .catch(error => {
            console.error('Failed to fetch player1 data:',error);
            this.loading = false;
        })
    },
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
        axios.get(`/api/v1/lineup/displayall?teamid=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.lineup = response.data;
            this.loading = false;

            const playerID1 = this.lineup[0].PLAYER1_ID;
            this.fetchplayerdata(playerID1)
            console.log('player1:',this.playerID1)

           
        })
        .catch(error => {
          console.error('Failed to fetch lineup data:',error);
          this.loading = false;
        })
        axios.get(`/api/v1/match/displayall?match_id=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.match = response.data;
            this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch match data:',error);
          this.loading = false;
        })
        axios.get(`/api/v1/medical/displayall?teamid=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.medical = response.data;
            this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch medical data:',error);
          this.loading = false;
        })
        axios.get(`/api/v1/record/getbyTeam/${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.record = response.data;
            this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch record data:',error);
          this.loading = false;
        })
      }
    },
    
  };
  </script>

  <style>
    .my-label {
    background: #5ab32e;
  }

  .my-content {
    background: #FDE2E2;
  }
  .el-drawer {
  transition: all 0.5s ease !important;
}
.team-image {
  width: 66%;
  height: 190px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.team-image img {
  max-width: 100%;
  max-height: 100%;
}

.team-info {
  display: flex;
  flex-wrap: wrap;
  height:100px;
}
.team-info p strong{
  margin-right:1rem;
  font-size: 18px;
}
.el-tag {
  margin-left: 1rem;
}

  </style>