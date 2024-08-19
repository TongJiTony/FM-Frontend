<template>
  <div>
    <el-button type="primary" size='small' icon="el-icon-arrow-left" @click="goBack" class="back-button1">返回</el-button>
    <h1 style="font-size: 20px">财政</h1>
    <p style="font-size: 12px">财政状况：安全</p>
    <el-tabs v-model="activeName">
    <el-tab-pane label="摘要" name="first">
      <el-container>
        <el-main>
          <el-row :gutter="12">
            <el-col :span="24" >
              <el-card class="box-card3">
                <h1 style="font-size: 18px;line-height: 0;">
                  <span style="margin-right: 350px;">总盈亏：¥{{ sum_amount }}</span>
                  <span style="margin-right: 350px;">总收入：¥{{ positiveSum }}</span>
                  <span >总支出：¥{{ negativeSum }}</span>
                </h1>
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
              <div class="echart-box" ref="lineChart"></div>
            </el-card>
           </el-col>
          </el-row>
        </el-main>
      </el-container>       
    </el-tab-pane>

    <el-tab-pane label="收入" name="second">
      <el-container>
        <el-main>
          <el-row :gutter="12">
            <el-col :span="12">
              <el-card class="box-card2">
                <h1 style="font-size: 20px;line-height: 0;">总收入：¥{{ positiveSum }}</h1>
                <div class="echart-box2" ref="lineChart2"></div>
              </el-card> 
            </el-col>
            <el-col :span="12">
              <el-card class="box-card2">
                <el-select v-model="selectedDate2" placeholder="请选择日期" class="el-select2"  @change="handlePosDateChange(selectedDate2)">
              <el-option
                v-for="item in dateOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
                <div class="echart-box2" ref="posbarChart"></div>
              </el-card> 
            </el-col>
          </el-row> 
          <el-col :span="24" style="height: 12px;"></el-col> 
          <el-card>
            <el-row class="title-selector-container" style="margin-bottom: 20px;">
              <h2 style="font-size: 20px; line-height: 40px;">收入明细</h2>
              <el-select v-model="selectedDate" placeholder="请选择日期" style="margin-left: auto;">
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-row>
            <el-table :data="filteredPosRecords" style="width: 100%">
              <el-table-column prop="DESCRIPTION" label="项目" width="1100">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" :formatter="formatAmount">
              </el-table-column>
            </el-table>
          </el-card>     
        </el-main>      
      </el-container>               
    </el-tab-pane>

    <el-tab-pane label="支出" name="third">
      <el-container>
        <el-main>        
          <el-row :gutter="12">
            <el-col :span="12">
              <el-card class="box-card2">
              <h1 style="font-size: 20px;line-height: 0;">总支出：¥{{ Math.abs(negativeSum) }}</h1>
              <div class="echart-box2" ref="lineChart3"></div>      
            </el-card>  
            </el-col>
             <el-col :span="12">
              <el-card class="box-card2">
                <el-select v-model="selectedDate2" placeholder="请选择日期" class="el-select2"  @change="handleNegDateChange(selectedDate2)">
              <el-option
                v-for="item in dateOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            <div class="echart-box2" ref="negbarChart"></div>      
          </el-card> 
             </el-col>
                         
          </el-row>
          <el-col :span="24" style="height: 12px;"></el-col> 
          <el-card>
            <el-row class="title-selector-container" style="margin-bottom: 20px;">
              <h2 style="font-size: 20px; line-height: 40px;">支出明细</h2>
              <el-select v-model="selectedDate" placeholder="请选择日期" style="margin-left: auto;">
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-row>
            <el-table :data="filteredNegRecords" style="width: 100%">
              <el-table-column prop="DESCRIPTION" label="项目" width="1100">
              </el-table-column>
              <el-table-column prop="AMOUNT" label="本月" :formatter="formatAmount">
              </el-table-column>
            </el-table>
          </el-card>
        
          </el-main>       
        </el-container>              
    </el-tab-pane>
    <el-tab-pane label="工资" name="fourth">
     
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
    height: 390px;
    box-shadow:none
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
  width: 600px;
  height: 300px;
  margin: 20px auto;
}
.back-button1 {
  float: right;
}
.title-selector-container {
  display: flex; /* 使用弹性布局 */
  align-items: center; /* 垂直居中对齐 */
  height: 40px; /* 设置容器的高度 */
}

.el-select {
  width: 150px; /* 设置选择器的宽度 */
}
.el-select2 {
  position: absolute;
  right: 2rem;
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
      activeName:'first',
      cur_month:'',
      pre_month:'',
      selectedDate: '2024-07', // 选择的日期
      dateOptions: [
        { label: '2024年8月', value: '2024-08' },
        { label: '2024年7月', value: '2024-07' },
        { label: '2024年6月', value: '2024-06' },
        { label: '2024年5月', value: '2024-05' }
        // 可以添加更多日期选项
      ],
      selectedDate2: '2024-07', // 初始化为空字符串
      dateOptions2: [
        { label: '2024年8月', value: '2024-08' },
        { label: '2024年7月', value: '2024-07' },
        { label: '2024年6月', value: '2024-06' },
        { label: '2024年5月', value: '2024-05' }
      ], // 初始化为空数组
    };
  },

  created() {
   
    this.fetchTeamRecords();
    this.currentMonth();
    this.previousMonth();

  },
  computed: {
    filteredPosRecords() {
      return this.records.filter(record => record.AMOUNT > 0 && record.TRANSACTION_DATE === this.selectedDate);
    },
    filteredNegRecords() {
      return this.records.filter(record => record.AMOUNT < 0 && record.TRANSACTION_DATE === this.selectedDate);
    },
    
  },

  methods: {
    handlePosDateChange(selectedDate2) {
    this.selectedDate2 = selectedDate2;
    
    const filteredRecords = this.records.filter(record => record.TRANSACTION_DATE === this.selectedDate2 && record.AMOUNT>0);
    this.renderPosBar(filteredRecords)
    
  },
    handleNegDateChange(selectedDate2) {
    this.selectedDate2 = selectedDate2;
    
    const filteredRecords = this.records.filter(record => record.TRANSACTION_DATE === this.selectedDate2 && record.AMOUNT<0);
    this.renderNegBar(filteredRecords)
    
  },
    currentMonth() {
      const date = this.currentDate;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      this.cur_month=`${year}-${month}`;
      console.log('current month:',this.cur_month)
      //return `${year}-${month}`;
    },
    previousMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() - 1); // 获取上个月的日期
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      this.pre_month=`${year}-${month}`;
     // return `${year}-${month}`;
    },
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
    formatAmount(row, column, cellValue) {
      return Math.abs(cellValue);
    },
    fetchTeamRecords() {
      const teamID = this.$route.params.teamID;
        axios.get(`/api/v1/record/search?team_id=${teamID}`)
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
          const posLineResult = Object.keys(datepositiveAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: datepositiveAmountMap[date]
          }));
          const negLineResult = Object.keys(datenegativeAmountMap).map(date => ({
          TRANSACTION_DATE: date,
          TOTAL_AMOUNT: datenegativeAmountMap[date]
          }));
         
          const posBarResult = this.records.filter(record => record.TRANSACTION_DATE === this.selectedDate2 && record.AMOUNT>0);
          const negBarResult = this.records.filter(record => record.TRANSACTION_DATE === this.selectedDate2 && record.AMOUNT<0);
        
          console.log('option3:',this.selectedDate2)
          this.renderPie(amounts);
          this.renderLine(result);
          this.renderLine2(posLineResult);
          this.renderLine3(negLineResult);
          this.renderPosBar(posBarResult)
          this.renderNegBar(negBarResult)
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

    renderLine(result) {
  const lineDom = this.$refs.lineChart; // 使用新的 ref
  const myChart = this.$echarts.init(lineDom);

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
    renderLine2(result) {
  const lineDom = this.$refs.lineChart2; // 使用新的 ref
  const myChart = this.$echarts.init(lineDom);

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
    renderLine3(result) {
  const lineDom = this.$refs.lineChart3; // 使用新的 ref
  const myChart = this.$echarts.init(lineDom);

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
    renderPosBar(filteredRecords){
    const barDom = this.$refs.posbarChart; // 使用新的 ref
    const myChart = this.$echarts.init(barDom);

    const items = filteredRecords.map(record => record.DESCRIPTION);
    const amounts = filteredRecords.map(record => Math.abs(record.AMOUNT));
    const option ={
      title: {
      text: '本月各项收入',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: items,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return (value / 10000).toFixed(2) + '万';
        }
      }
    },
    series: [
      {
        data: amounts,
        type: 'bar',
        label: {
        show: true,
        position: 'top', // 将数值标签显示在柱子的上方
        formatter: function (params) {
          return (params.value / 10000).toFixed(2) + '万';
        }
      }
      }
    ]
  };
  myChart.setOption(option);
  },
    renderNegBar(filteredRecords){
    const barDom = this.$refs.negbarChart; // 使用新的 ref
    const myChart = this.$echarts.init(barDom);
  
    const items = filteredRecords.map(record => record.DESCRIPTION);
    const amounts = filteredRecords.map(record => Math.abs(record.AMOUNT));

    //const items = result.map(record => record.ITEM);
    //const amounts = result.map(record => record.TOTAL_AMOUNT);
    const option ={
      title: {
      text: '本月各项支出',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: items,
      axisLabel: {
                interval: 0, // 显示所有的x轴标签
                formatter: function (value) {
                    return value;
                }
            }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return (value / 10000).toFixed(2) + '万';
        }
      }
    },
    series: [
      {
        data: amounts,
        type: 'bar',
        label: {
        show: true,
        position: 'top', // 将数值标签显示在柱子的上方
        formatter: function (params) {
          return (params.value / 10000).toFixed(2) + '万';
        }
      }
      }
    ]
  };
  myChart.setOption(option);
  }
  },
};
</script>
