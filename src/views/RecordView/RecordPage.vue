<template>
  <div>
    <h1 style="font-size: 20px">财政</h1>
    <p style="font-size: 12px">财政状况：安全</p>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="摘要" name="first">
     
    <e1-row gutter="20">
      <e1-col span="12" >
          <e1-card class="box-card2">
            <p>总盈亏：¥{{ sum_amount }}</p>
            <p>预算：</p>
          </e1-card>
      </e1-col>
      <e1-col span="12">
        <e1-card class="box-card">
          <div class="echart-box" ref="pieChart"></div>
        </e1-card>  
        <e1-card class="box-card">
          <div class="echart-box" ref="barChart"></div>
        </e1-card>
      </e1-col>
    </e1-row>
 
    </el-tab-pane>
    <el-tab-pane label="收入" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="支出" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="工资" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
 
  </div>
  
</template>

<style scoped>
.box-card {
    width: 100%;
    height: 390px;
   
  }
.box-card2 {
    width: 100%;
    height: 800px;
   
  }
.echart-box {
  width: 500px;
  height: 350px;
  margin: 20px auto;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      records: [],
      sum_amount:[],
    };
  },

  created() {
    this.fetchTeamRecords();
  },

  methods: {
    fetchTeamRecords() {
      const teamID = this.$route.params.teamID;
      axios.get(`/api/v1/record/displayall?team_id=${teamID}`)
        .then(response => {
          console.log('Received record data:', response.data);
          this.records = response.data;
          this.loading = false;
          this.sum_amount = this.records.reduce((acc, record) => {
          return acc + record.AMOUNT;
          }, 0);
          this.renderPie();
          this.renderBar();
      
          console.log('sum_amount:',this.sum_amount)
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

    renderBar() {
      const barDom = this.$refs.barChart; // 使用新的 ref
      const myChart = this.$echarts.init(barDom);
      
      const dates = this.records.map(record => record.TRANSACTION_DATE);
      const amounts = this.records.map(record => record.AMOUNT);

      const option = {
        title: {
          text: '每月收支',
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: dates,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: amounts,
          type: 'line',
        }],
      };

      myChart.setOption(option);
    },
  },
};
</script>
