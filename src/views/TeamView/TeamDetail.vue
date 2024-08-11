<template>
   <div>
    <p v-if="loading">Loading team data...</p>
    <div v-else>
      <div v-if="team">
        <el-row>        
          <el-card shadow="never" class="box-card3">
            <div slot="header" class="clearfix">
              <span style="font-size: 20px;font-weight: bold;">球队简介</span>
              <el-button type="primary" size='small' icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
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
                <span style="font-size: 20px;font-weight: bold;">关键人物</span>
                <e1-button-group>
                  <el-button type="primary" size='small' @click="handleRecruitPlayer" class="back-button1">更多球员</el-button>    
                  <el-button type="primary" size='small' @click="handleRecruitPlayer" class="back-button2">招募球员</el-button> 
                </e1-button-group>        
              </div> 
              <el-container>
                <el-main>
                  <el-table :data="topPlayers" style="width: 100% ;height:250px" >
                    <el-table-column prop="PLAYER_NAME" label="球员姓名" width="150"></el-table-column>
                    <el-table-column prop="ROLE" label="位置" width="150"></el-table-column>
                    <el-table-column prop="RANK" label="评分" width="150"></el-table-column>
                    <el-table-column>
                      <!-- eslint-disable-next-line -->           
                      <template slot-scope="scope">
                        <el-button @click="handlePlayerDetails(scope.row)" type="text" size="small">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-main>    
              </el-container>          
            </el-card>
            <el-col :span="24" style="height: 20px;"></el-col> 
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">竞争对手</span>
                <el-button type="primary"  size='small' @click="handleRecruitPlayer" class="back-button1">查看比赛</el-button>
              </div>
              <el-container>
                <el-main>         
                  <el-table :data="filteredMatches" style="width: 100%;height:250px ">
                    <el-table-column prop="MATCH_ID" label="比赛ID" width="150" ></el-table-column>
                    <el-table-column prop="HOME_TEAM_NAME" label="主场球队" width="150" ></el-table-column>
                    <el-table-column prop="AWAY_TEAM_NAME" label="客场球队" ></el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currentPage2"
                    :pager-count="5"
                    :page-sizes="[3]"
                    :page-size="pageSize2"
                    layout="sizes, prev, pager, next, jumper"
                    :total="record.length"
                  ></el-pagination>
                </el-main>   
              </el-container>           
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never" class="box-card2">
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;font-weight: bold;">财务信息</span>
                <el-button type="primary"  size='small' @click="handleClickRecord" class="back-button1">查看详情</el-button>
              </div> 
              <container>
                <e1-main>
                  <e1-row  class="echart-box" ref="pieChart"></e1-row>
                  <el-col :span="24" style="height: 20px;"></el-col> 
                  <e1-row  class="echart-box" ref="barChart"></e1-row>                 
                </e1-main>
              </container>
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
        topPlayers:[],
      };
    },
    created() {
      this.fetchTeamDetail()
      this.fetchTeamRecords()
      this.getTopPlayers()
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
    handleClickRecord(){
      const teamID = this.$route.params.teamID;
      console.log('Click Record:',teamID);
      this.$router.push(`/record/${teamID}`); 
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
            this.topPlayers = this.player
      .sort((a, b) => b.RANK - a.RANK) // 按 RANK 降序排序
      .slice(0, 3); // 取前三个元素
      console.log('TOPPLAYER',this.topPlayers)
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
      axios.get(`/api/v1/record/displayall?team_id=${teamID}`)
        .then(response => {
          console.log('Received record data:', response.data);
          this.records = response.data;
          this.loading = false;
          let positiveSum = 0;
          let negativeSum = 0;
          this.records.forEach(record => {
          if (record.AMOUNT > 0) {
            positiveSum += record.AMOUNT;
          } else if (record.AMOUNT < 0) {
            negativeSum += record.AMOUNT;
          }
          });
          const amounts=[positiveSum,negativeSum];
          console.log("Positive Sum:", positiveSum);
          console.log("Negative Sum:", negativeSum);
          // 用于存储每个日期的金额之和
          const dateAmountMap = {};
          // 遍历 records 数组
          this.records.forEach(record => {
          const date = record.TRANSACTION_DATE;
          const amount = record.AMOUNT;
          // 如果日期不存在于 dateAmountMap 中，初始化它
          if (!dateAmountMap[date]) {
            dateAmountMap[date] = 0;
          }
          // 累加金额到对应日期
          dateAmountMap[date] += amount;
          });
          // 将结果转换为数组形式
          const result = Object.keys(dateAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: dateAmountMap[date]
          }));
          this.renderPie(amounts);
          this.renderBar(result);
        })
        .catch(error => {
          console.error('Failed to fetch record data:', error);
          this.loading = false;
        });
    },
    renderPie(amounts) {
      const pieDom = this.$refs.pieChart; // 使用新的 ref
      const myChart = this.$echarts.init(pieDom);
      
      const pieData = amounts.map((amount, index) => {
  // 根据索引确定数据的类别（收入或支出）
      const category = index === 0 ? '收入' : '支出';
  // 创建包含 name 和 value 属性的对象
      return {
        name: category,
        value: Math.abs(amount), // 取绝对值，因为支出可能是负数
      };
      });

      const option = {
        title: {
          text: '总收支占比',
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
    renderBar(result) {
  const barDom = this.$refs.barChart; // 使用新的 ref
  const myChart = this.$echarts.init(barDom);

  const dates = result.map(record => record.TRANSACTION_DATE);
  const amounts = result.map(record => record.TOTAL_AMOUNT);

  const option = {
    title: {
      text: '每月收支变化',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return (value / 10000).toFixed(2) + '万';
        }
      }
    },
    series: [{
      data: amounts,
      type: 'line',
      label: {
        show: true,
        formatter: function (params) {
          return (params.value / 10000).toFixed(2) + '万';
        }
      }
    }],
  };

  myChart.setOption(option);
},
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
.box-card3 {
    width: 100%;
    height: 350px;
   
  }
.box-card2 {
    width: 100%;
    height: 800px;
   
  }
.box-card {
    width: 100%;
    height: 390px;
   
  }
  .card-header{
  margin-left: 1rem;
 
  }
.back-button2 {
  float: right;
  margin-right: 10px;
  background-color: #0bac51;
}
.back-button1 {
  float: right;
  margin-left: 10px;
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
  width: 600px;
  height: 350px;
  margin: 20px auto;
  
}
  </style>