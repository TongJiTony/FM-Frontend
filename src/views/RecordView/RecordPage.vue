<template>
  <div class="echart-box" ref="box">
    
    
</div>  
</template>

<style scoped>
    .echart-box{
        width: 500px;
        height: 350px;
        border: 3px solid pink;
        margin: 20px auto;
    }

</style>

<script>


export default {
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
             }
           
</script>
