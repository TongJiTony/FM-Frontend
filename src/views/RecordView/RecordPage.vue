<template>
  <div>
    <el-button type="primary" size='small' icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
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

    <el-tab-pane label="收入" name="second">
      <el-table :data=" records.filter(record => record.AMOUNT > 0)" style="width: 100%">
              <el-table-column prop="DESCRIPTION" label="项目" width="200">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" width="200">
              </el-table-column>
            </el-table>
    </el-tab-pane>

    <el-tab-pane label="支出" name="third">
      <el-table :data=" records.filter(record => record.AMOUNT < 0)" style="width: 100%">
              <el-table-column prop="DESCRIPTION" label="项目" width="200">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" width="200"  :formatter="formatAmount">
              </el-table-column>
            </el-table>
    </el-tab-pane>
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
.back-button1 {
  float: right;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      records: [],
      sum_amount:0,
      positiveSum:0,
      negativeSum:0,
    };
  },

  created() {
    this.fetchTeamRecords();
  },

  methods: {
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
    formatAmount(row, column, cellValue) {
    return Math.abs(cellValue);
  },
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

          let positiveSum = 0;
          let negativeSum = 0;
          this.records.forEach(record => {
          if (record.AMOUNT > 0) {
            positiveSum += record.AMOUNT;
          } else if (record.AMOUNT < 0) {
            negativeSum += record.AMOUNT;
          }
          });
          this.negativeSum=negativeSum;
          this.positiveSum=positiveSum;
          const amounts=[positiveSum,negativeSum];
          console.log("Positive Sum:", positiveSum);
          console.log("Negative Sum:", negativeSum);
      
          this.renderPie(amounts);
          this.renderBar();
      
          console.log('sum_amount:',this.sum_amount)
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

    renderBar() {
      const barDom = this.$refs.barChart; // 使用新的 ref
      const myChart = this.$echarts.init(barDom);
      
      const dates = this.records.map(record => record.TRANSACTION_DATE);
      const amounts = this.records.map(record => record.AMOUNT);

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
