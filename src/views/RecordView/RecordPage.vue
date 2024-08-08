<template>
  <div class="parent-container">
    <e1-row gutter="20">
      <e1-col span="12">
        <e1-card class="echart-box" ref="pieChart">
        </e1-card>
        
       
      </e1-col>
      <e1-col span="12">
        <e1-card class="echart-box" ref="barChart">
        </e1-card>
      </e1-col>
    </e1-row>
  </div>
</template>

<style scoped>
.parent-container {
  width: 100%;
  display: flex; /* 使用Flex布局 */
  justify-content: space-between; /* 控制子元素的排列方式 */
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
    };
  },

  created() {
    this.fetchTeamRecords();
  },

  methods: {
    fetchTeamRecords() {
      const teamID = this.$route.params.teamID;
      axios.get(`/api/v1/record/getbyTeam/${teamID}`)
        .then(response => {
          console.log('Received record data:', response.data);
          this.records = response.data;
          this.loading = false;
          this.renderPie();
          this.renderBar();
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
