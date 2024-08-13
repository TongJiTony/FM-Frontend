<template>
  <div>
    <el-button type="primary" size='small' icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
    <h1 style="font-size: 20px">财政</h1>
   
    <p style="font-size: 12px">财政状况：安全</p>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="摘要" name="first"> 
    
         <el-container>
        <el-main>
          <el-row :gutter="12">
      <el-col :span="24" >
          <el-card class="box-card3">
            <h1 style="font-size: 18px;line-height: 0;">总盈亏：¥{{ sum_amount }}</h1>
            <p style="font-size: 12px;line-height: 1;">预算：</p>
          </el-card>
</el-col>
        <el-col :span="24" style="height: 12px;"></el-col> 

      <el-col :span="12">
        <el-card class="box-card">
          <div class="echart-box" ref="pieChart"></div>
        </el-card>  
          </el-col>
        <el-col :span="12">
        <el-card class="box-card">
          <div class="echart-box" ref="barChart"></div>
        </el-card>
      </el-col>
    </el-row>
          </el-main>
          </el-container>  
      
    </el-tab-pane>

    <el-tab-pane label="收入" name="second">
      <el-container>
        <el-main>
                     <el-row>


                <el-col :span="24" >
          <el-card class="box-card3">
            <el-row>
        <el-col :span="12" style="height: 1px;"></el-col> 
              <el-col :span="6">
              <p style="font-size: 1px;line-height: 0;">本月</p>
            </el-col>      
              <el-col :span="6">
              <p style="font-size: 1px;line-height: 0;">上月</p>
            </el-col>      
 
             <el-col span="12">
              <h1 style="font-size: 20px;line-height: 0;">总收入</h1>
            </el-col>  
            <el-col span="6">
              <h2>¥{{ positiveSum }}</h2>
            </el-col>  
            <el-col span="6">
              <h2>¥{{ positiveSum }}</h2>
            </el-col>  
            </el-row>
      </el-card>
                </el-col>
                            </el-row>
            <el-col :span="24" style="height: 12px;"></el-col> 
                        <el-row>
                           <div class="echart-box2" ref="barChart2"></div>
                        </el-row>
              
                 <el-table :data=" records.filter(record => record.AMOUNT > 0 & record.TRANSACTION_DATE==='2024-07')" style="width: 100%">
              <el-table-column prop="DESCRIPTION" label="项目" width="1100">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" width="200">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="上月">
              </el-table-column>
            </el-table>     
      </el-main>
        
              </el-container>          
         
    </el-tab-pane>

    <el-tab-pane label="支出" name="third">
        <el-container>
        <el-main>
           <el-row>

                <el-col :span="24" >

          <el-card class="box-card3">
            <el-row>
        <el-col :span="12" style="height: 1px;"></el-col> 
              <el-col :span="6">
              <p style="font-size: 1px;line-height: 0%;">本月</p>
            </el-col>      
              <el-col :span="6">
              <p style="font-size: 1px;line-height: 0%;">上月</p>
            </el-col>      
            <el-row>

            </el-row>
             <el-col span="12">
               <h1 style="font-size: 20px;line-height: 0;">总支出</h1>
            </el-col>  
            <el-col span="6">
              <h2>¥{{ Math.abs(negativeSum) }}</h2>
            </el-col>  
            <el-col span="6">
              <h2>¥{{ Math.abs(negativeSum) }}</h2>
            </el-col>  
            </el-row>
      </el-card>
                </el-col>
                </el-row>
              <el-col :span="24" style="height: 12px;"></el-col> 
 <el-row>
                           <div class="echart-box2" ref="barChart3"></div>
                        </el-row>
                <el-table :data=" records.filter(record => record.AMOUNT < 0)" style="width: 100%">
                   <el-table-column prop="DESCRIPTION" label="项目" width="1100">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" :formatter="formatAmount">
              </el-table-column>
            </el-table>
      </el-main>
        
              </el-container>          
         
      
    </el-tab-pane>
    <el-tab-pane label="工资" name="fourth">
      <time class="time">本月：{{ currentMonth }}</time>
      <time class="time">上月：{{ previousMonth }}</time>
    </el-tab-pane>
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
  .box-card3 {
    width: 100%;
    height: 100px;
   
  }
.echart-box {
  width: 600px;
  height: 350px;
  margin: 20px auto;
}
.echart-box2 {
  width: 1500px;
  height: 300px;
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
      currentDate: new Date(),
      activeName:'first'
    };
  },

  created() {
    this.fetchTeamRecords();
  },
  computed: {
    currentMonth() {
      const date = this.currentDate;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    },
    previousMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() - 1); // 获取上个月的日期
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    }
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
          
          // 用于存储每个日期的金额之和
          const dateAmountMap = {};
          const datenegativeAmountMap = {};
          const datepositiveAmountMap = {};
          // 遍历 records 数组
          this.records.forEach(record => {
          const date = record.TRANSACTION_DATE;
          const amount = record.AMOUNT;
          // 如果日期不存在于 dateAmountMap 中，初始化它
          if (!dateAmountMap[date]) {
            dateAmountMap[date] = 0;
            }
            if (!datenegativeAmountMap[date]) {
            datenegativeAmountMap[date] = 0;
            }
            if (!datepositiveAmountMap[date]) {
            datepositiveAmountMap[date] = 0;
          }
          // 累加金额到对应日期
            dateAmountMap[date] += amount;
            if (amount > 0) {
              datepositiveAmountMap[date] += amount;
            }
            else {
              datenegativeAmountMap[date] += Math.abs(amount);
            }
          });
          // 将结果转换为数组形式
          const result = Object.keys(dateAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: dateAmountMap[date]
          }));
          const positiveresult = Object.keys(datepositiveAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: datepositiveAmountMap[date]
          }));
          const negativeresult = Object.keys(datenegativeAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: datenegativeAmountMap[date]
          }));

          // 输出结果
          console.log('amount for data:',result);

          this.renderPie(amounts);
          this.renderBar(result);
          this.renderBar2(positiveresult);
          this.renderBar3(negativeresult);
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
    renderBar2(result) {
  const barDom = this.$refs.barChart2; // 使用新的 ref
  const myChart = this.$echarts.init(barDom);

  const dates = result.map(record => record.TRANSACTION_DATE);
  const amounts = result.map(record => record.TOTAL_AMOUNT);

  const option = {
    title: {
      text: '每月收入变化',
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
 renderBar3(result) {
  const barDom = this.$refs.barChart3; // 使用新的 ref
  const myChart = this.$echarts.init(barDom);

  const dates = result.map(record => record.TRANSACTION_DATE);
  const amounts = result.map(record => record.TOTAL_AMOUNT);

  const option = {
    title: {
      text: '每月支出变化',
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
