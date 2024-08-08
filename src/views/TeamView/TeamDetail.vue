<template>
   <div>
    <h1></h1>
    <p v-if="loading">Loading team data...</p>
    <div v-else>
      <div v-if="team">
        <el-row>        
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">球队简介</span>
                <el-button type="primary" icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
              </div>
             
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
            </el-card>
        </el-row>

        <el-col :span="24" style="height: 20px;"></el-col> 

       
          <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">球员信息</span>
                <el-button type="primary" size='small' @click="handleRecruitPlayer" class="back-button1">招募球员</el-button>
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

            <el-col :span="24" style="height: 20px;"></el-col> 

            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">竞争对手</span>
                <el-button type="primary"  size='small' @click="handleRecruitPlayer" class="back-button1">查看比赛</el-button>
                <el-container>
                  <el-main>         
                    <el-table :data="filteredMatches" style="width: 100%;height:250px ">
                      <el-table-column prop="MATCH_ID" label="比赛ID" width="150" >
                      </el-table-column>
                      <el-table-column prop="HOME_TEAM_NAME" label="主场球队" width="150" >
                      </el-table-column>
                      <el-table-column prop="AWAY_TEAM_NAME" label="客场球队" >
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
            <el-card shadow="never" class="box-card2">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">财务信息</span>
                <el-button type="primary"  size='small' @click="handleClickRecord" class="back-button1">查看详情</el-button>
                <container>
                  <e1-main>
                    <div class="echart-box" ref="pieChart"></div>
                  </e1-main>
                </container>
              </div> 
            </el-card>
          </el-col>
        </el-row>
        <el-col :span="24" style="height: 20px;"></el-col> 
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
      this.fetchTeamRecords()
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
        const matches=match.slice((this.currentPage2 - 1) * this.pageSize2, this.currentPage2 * this.pageSize2);
        return matches.filter(match => {
      return (
        match.HOME_TEAM_NAME === this.team[0].TEAM_NAME ||
        match.AWAY_TEAM_NAME === this.team[0].TEAM_NAME
      );
    });
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
    handleRecruitPlayer(){

    },
    handleClickLineup(){
      const teamID = this.$route.params.teamID;
      console.log('Click line up:',teamID);
      this.$router.push(`/lineup/${teamID}`); 
    },
    handleClickRecord(){
      const teamID = this.$route.params.teamID;
      console.log('Click Record:',teamID);
      this.$router.push(`/record/${teamID}`); 
    },
    handleClickMedical(){

    },
    handleClickMatch(){

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
        });

        axios.get(`/api/v1/match/displayall?match_id=${teamID}`)
          .then(response => {
            console.log('Received data:', response.data);
            this.match = response.data;
            this.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch match data:',error);
          this.loading = false;
        });
      },
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
    fetchTeamRecords() {
      const teamID = this.$route.params.teamID;
      axios.get(`/api/v1/record/getbyTeam/${teamID}`)
        .then(response => {
          console.log('Received record data:', response.data);
          this.records = response.data;
          this.loading = false;
          this.renderPie();
        })
        .catch(error => {
          console.error('Failed to fetch record data:', error);
          this.loading = false;
        });
    },
    renderPie() {
      const pieDom = this.$refs.pieChart; // 使用新的 ref
      const myChart = this.$echarts.init(pieDom);
      
      const pieData = this.records.map(record => ({
        name: record.DESCRIPTION,
        value: record.AMOUNT,
      }));

      const option = {
        title: {
          text: '总交易占比',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [{
          name: 'Amount',
          type: 'pie',
          radius: '50%',
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }],
      };

      myChart.setOption(option);
    },
    },
    mounted(){
                            // 基于准备好的dom，初始化echarts实例
            const userdom = this.$refs.box
            const mycart = this.$echarts.init(userdom)
                const option = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
            mycart.setOption(option)
        },
  };
  
  </script>

  <style scoped>
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

.box-card2 {
    width: 100%;
    height: 720px;
   
  }
.box-card {
    width: 100%;
    height: 350px;
   
  }
  .card-header{
  margin-left: 1rem;
  background-color: rgb(22, 111, 62); /* 设置你想要的底色 */
  }
  .back-button1 {
  float: right;
}
.bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height:200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .el-card .el-card__body {
  text-align: center;
}
h2 {
    margin-left: 0px;
}
.echart-box {
  width: 500px;
  height: 250px;
  margin: 20px auto;
}
  </style>