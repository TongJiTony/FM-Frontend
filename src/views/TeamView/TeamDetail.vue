<template>
   <div>
    <h1></h1>
    <p v-if="loading">Loading team data...</p>
    <div v-else>
      <div v-if="team">
        <el-row>
          <el-col :span="24">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">球队简介</span>
                <el-button type="primary" icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
              </div>
              <el-row :gutter="20">
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
            </el-card>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">球员信息</span>
                <el-container>
                  <el-main>
                    <el-table :data="filteredPlayers" style="width: 100% ;height:250px" >
                      <el-table-column prop="PLAYER_ID" label="球员编号" width="150">
                      </el-table-column>
                      <el-table-column prop="PLAYER_NAME" label="球员姓名" width="150">
                      </el-table-column>
                      <el-table-column prop="ROLE" label="战术角色" width="150">
                      </el-table-column>
                      <el-table-column>
                      <!-- eslint-disable-next-line -->           
                        <template slot-scope="scope">
                          <el-button @click="handlePlayerDetails(scope.row)" type="text" size="small">查看详情</el-button>
                        </template>
                       </el-table-column>
                    </el-table>
                    <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currentPage1"
                    :page-sizes="[3]"
                    :page-size="pageSize1"
                    layout="sizes, prev, pager, next, jumper"
                    :total="player.length"
                    ></el-pagination>
                  </el-main>    
                </el-container>
              </div> 
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">财务记录</span>
                <el-container>
                  <el-main>         
                    <el-table :data="filteredRecords" style="width: 100% ;height:250px">
                      <el-table-column prop="RECORD_ID" label="财务记录ID" width="150" >
                      </el-table-column>
                      <el-table-column prop="DESCRIPTION" label="交易描述" width="150">
                      </el-table-column>
                      <el-table-column prop="TRANSACTION_DATE" label="交易日期" width="190">
                      </el-table-column>
                      <el-table-column prop="AMOUNT" label="金额">
                      </el-table-column>            
                    </el-table>
                    <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :page-sizes="[3]"
                    :page-size="pageSize2"
                    layout="sizes, prev, pager, next, jumper"
                    :total="record.length"
                    ></el-pagination>
                  </el-main>    
                </el-container>
              </div>
            </el-card>
          </el-col>
           <el-col :span="12">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">阵容信息</span>
                <el-container>
                  <el-main>   
                    <el-table :data="filteredLineups" style="width: 100%;height:250px" >
                      <el-table-column prop="LINEUP_ID" label="阵容ID">
                      </el-table-column>
                    </el-table>
                     <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :page-sizes="[3]"
                    :page-size="pageSize2"
                    layout="sizes, prev, pager, next, jumper"
                    :total="record.length"
                    ></el-pagination>
                  </el-main>    
                </el-container>
              </div> 
            </el-card>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">比赛信息</span>
                <el-container>
                  <el-main>         
                    <el-table :data="filteredMatches" style="width: 100%;height:250px ">
                      <el-table-column prop="MATCH_ID" label="比赛ID" width="150" >
                      </el-table-column>
                      <el-table-column prop="HOME_TEAM_ID" label="主场球队ID" width="150" >
                      </el-table-column>
                      <el-table-column prop="AWAY_TEAM_ID" label="客场球队ID" >
                      </el-table-column>
                    </el-table>
                    <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :page-sizes="[3]"
                    :page-size="pageSize2"
                    layout="sizes, prev, pager, next, jumper"
                    :total="record.length"
                    ></el-pagination>
                  </el-main>    
                </el-container>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">医疗信息</span>
                <el-container>
                  <el-main>         
                    <el-table :data="filteredMedicals" style="width: 100%;height:250px ">
                      <el-table-column prop="medical_id" label="医疗处理ID" width="150" >
                      </el-table-column>
                      <el-table-column prop="player_id" label="球员ID">
                      </el-table-column>      
                    </el-table>
                    <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :page-sizes="[3]"
                    :page-size="pageSize2"
                    layout="sizes, prev, pager, next, jumper"
                    :total="record.length"
                    ></el-pagination>
                  </el-main>    
                </el-container>
              </div>
            </el-card>
          </el-col>
        </el-row>  



        
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
        loading:true,
        team: null,
        player: [],
        record:[],
        lineup: [],
        match: [],
        medical:[],
        tabPosition: "left",
        search:'',
        currentPage1: 1, // 当前页码
        pageSize1: 3, // 每页显示条数
        currentPage2: 1, // 当前页码
        pageSize2: 3, // 每页显示条数
      };
    },
    created() {
      this.fetchTeamDetail()
  
    },
    computed: {
    filteredPlayers() {
      const { player, search } = this;
      if (!search) {
        return player.slice((this.currentPage1 - 1) * this.pageSize1, this.currentPage1 * this.pageSize1);
      } else {
        const filtered = player.filter(data => data.PLAYER_NAME.includes(search));
        return filtered.slice((this.currentPage1 - 1) * this.pageSize1, this.currentPage1 * this.pageSize1);
      }
    },
    filteredRecords() {
      const { record, search } = this;
      if (!search) {
        return record.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      } else {
        const filtered = record.filter(data => data.RECORD_ID.includes(search));
        return filtered.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      }
      },
     filteredLineups() {
      const { lineup, search } = this;
      if (!search) {
        return lineup.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      } else {
        const filtered = lineup.filter(data => data.LINEUP_ID.includes(search));
        return filtered.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      }
      },
      filteredMatches() {
      const { match, search } = this;
      if (!search) {
        return match.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      } else {
        const filtered = match.filter(data => data.MATCH_ID.includes(search));
        return filtered.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      }
      },
     filteredMedicals() {
      const { medical, search } = this;
      if (!search) {
        return medical.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      } else {
        const filtered = medical.filter(data => data.medical_id.includes(search));
        return filtered.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
      }
      },
  },
    methods: {
      handlePlayerDetails(row) {
      console.log('Navigating to player detail page for:', row.PLAYER_ID);
      const playerId = row.PLAYER_ID;
      const route = `/player-display/${playerId}`;
      this.$router.push(route);
    },
      handleSizeChange1(val) {
      this.pageSize1 = val;
      this.currentPage1 = 1; // 每次改变每页条数时，重置当前页为第一页
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },
    handleSizeChange2(val) {
      this.pageSize2= val;
      this.currentPage2 = 1; // 每次改变每页条数时，重置当前页为第一页
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
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
      },
      goBack() {
      this.$router.go(-1); // Navigate to the previous page
    }
    },
   
  };
  </script>

  <style>
.team-image {
  width: 60%;
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
.box-card {
    width: 100%;
    height: 370px;
   
  }
  .card-header{
  margin-left: 1rem;
  background-color: rgb(22, 111, 62); /* 设置你想要的底色 */
  }
  .back-button1 {
  float: right;

 
}
  </style>