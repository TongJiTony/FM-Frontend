<template>
    <div>
      <el-card class="card-style">
        <div>
            <el-button type="primary" size='small' icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
       
            <h1>
  <el-statistic
    :title="`${match[0].HOME_TEAM_NAME} VS ${match[0].AWAY_TEAM_NAME}`"
    style="font-size: 32px;"
  >
    <template slot="formatter">
      <span style="font-size: 36px;">{{ match[0].HOME_TEAM_SCORE }}</span>
      <span style="font-size: 36px;">-</span>
      <span style="font-size: 36px;">{{ match[0].AWAY_TEAM_SCORE }}</span>
    </template>
  </el-statistic>
  
</h1>
        </div>
     

       <el-card class="card-style">
        <el-row>
            <el-col>
                <h4 style="font-size: 20px;">
                比赛时间：{{ match[0].MATCH_DATE }}
                </h4>
                <p style="font-size: 20px;">
                    比赛事件：
                    <template>
                        <el-tag
                        style="font-size: 20px;"
                            :type="
                            event[0].EVENT_TYPE === '黄牌'
                            ? 'warning'
                            : event[0].EVENT_TYPE === '换人'
                            ? 'danger'
                            : 'default'">
                            {{ event[0].EVENT_TYPE }}
                        </el-tag>
                    </template>
                </p>          
                <h4 style="font-size: 20px;font-weight: bold;">相关球员：{{ player[0].PLAYER_NAME }} </h4>
                    <p style="font-size: 20px;">
                        所属队伍：{{ player[0].TEAM_NAME }}
                    </p>
               
            </el-col>
           <el-col>

           </el-col>
          
        </el-row>
       </el-card>
       <el-col :span="24" style="height: 12px;"></el-col> 
       <el-card class="card-style">
          <div class="calendar-container">
            <div class="calendar-header">
                <button @click="changeMonth(-1)" class="calendar-nav-button">上个月</button>
                    <h3 class="calendar-title">当前日期：{{ displayMonthYear }}</h3>
                    <button @click="changeMonth(1)" class="calendar-nav-button">下个月</button>
            </div>
            <div class="calendar-grid">
                <div v-for="date in surroundingDates" :key="date" class="calendar-day">
                {{ date }}
                </div>
            </div>
          </div>
        </el-card>
      </el-card>
    </div>
  </template>
  
  <style scoped>
.card-style{
  background-color: rgba(255, 255, 255, 0.8);
}
.back-button1 {
  float: right;
  margin-left: 10px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-nav-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
}

.calendar-title {
  margin: 0;
}

.calendar-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.calendar-day {
  padding: 10px;
  border: 1px solid #ddd;
  margin: 5px;
}

  </style>

<script>
import axios from 'axios';


export default {

    data(){
        return{
            match:[],
            event:[],
            currentDate: new Date(),
            player:[],
        };
    },
    created(){
        this.fetchMatchData();
        this.fetchEventData();
      
    },
    computed: {
        surroundingDates() {
      const dates = [];
      const baseDate = new Date(this.currentDate);

      for (let i = -3; i <= 3; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        dates.push(this.formatDate(date));
      }

      return dates;
    },
    displayMonthYear() {
  const year = this.currentDate.getFullYear();
  const month = this.currentDate.getMonth() + 1; // 月份从 0 开始计数，所以需要加 1
  const day = this.currentDate.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
  },
    methods:{
        goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
        fetchPlayerData() {
      const playerId = this.event[0].PLAYER_ID;
      axios
        .get(`/api/v1/player/displayone?playerid=${playerId}`)
        .then((response) => {
          console.log("Received data:", response.data);
          this.player = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Failed to fetch player data:", error);
          this.loading = false;
        });
    },
        formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    changeMonth(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.currentDate = newDate;
    },
        fetchMatchData(){
            const matchID = this.$route.params.matchID;
            axios.get(`/api/v1/match/search?match_id=${matchID}`)
          .then(response => {
            console.log('Received match data:', response.data);
            this.match = response.data;
            this.baseDate = new Date(response.data.MATCH_DATE); // 更新 baseDate
          })
          .catch(error => {
            console.error('Failed to fetch match data:', error);
          });   
        },
        fetchEventData(){
            const matchID = this.$route.params.matchID;
            axios.get(`/api/v1/event/search?match_id=${matchID}`)
          .then(response => {
            console.log('Received event data:', response.data);
            this.event = response.data;
            this.fetchPlayerData();
          })
          .catch(error => {
            console.error('Failed to fetch event data:', error);
          }); 
        },
    },
}
</script>

