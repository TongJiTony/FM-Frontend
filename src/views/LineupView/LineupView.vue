<template>
  <div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <el-container class="home-container">
        <!--头部  -->
        <el-header>阵容表
           <div class = "button-contanier">
            <el-button type="primary" @click="addLineup" class = "add_button">添加阵容</el-button>

            <el-button type="info" @click="goback" class = "goback_button">返回上级页面</el-button>
          </div>
        </el-header>
        <!-- 侧栏 -->
         
        <!-- 页面主体区 -->
        <el-container>
          <el-main>
            <el-table
            :data = "lineupData"
            border
            style = "width: 100%">
            <el-table-column
              prop="TEAM_NAME"
              label="team_name"
              :width="180">
            </el-table-column>
            <el-table-column
              prop="LINEUP_ID"
              label="id"
              :width="180">
            </el-table-column>
            <el-table-column
              prop="NOTE"
              label="备注"
              :width="180">
            </el-table-column>
            <el-table-column
              label="操作"
              :width="180">
              <template slot-scope="scope">
                <el-button @click="clickDetails(scope.row)">详情</el-button>
              </template>
              </el-table-column>
            </el-table>
           
          </el-main>
        </el-container>
        <!-- notes -->
        <!-- <div class="note-box">
          NOTE: {{ lineup[activeItem - 1].NOTE }}
        </div> -->

      </el-container>
    </div>
  </div>
</template>

   
<script>
import axios from 'axios';


export default {
  name: 'LineupView',
  data() {
    return {
      loading: true,
      lineupData:[],
    };
  },
  created() {
    this.fetchLineups();
  },

  methods: {
    fetchLineups() {
      this.loading = true;
      axios.get('/api/v1/lineup/displayall')
        .then((response) => {
          this.lineupData = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    goback() {
      window.sessionStorage.clear();
      this.$router.go(-1);
    },
    clickDetails(row) {
      console.log("target: ", `/lineup/${row.LINEUP_ID}`);
      this.$router.push(`/lineup/${row.LINEUP_ID}`);
    },
  },
};
</script>



<style scoped>
  .home-container{
    height: 100%;
   }
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items:center;
    color:#fff;
    font-size: 20px;
  }
  .button-contanier{
    display: flex;
    justify-content: flex-end;
  }
  /* .add_button {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .goback_button {
    background-color: #909399;
    border-color: #909399;
  } */
    .note-box {
    width: 100%;
    height: 50px; /* 设置展示框的高度 */
    background-color: #f0f0f0; /* 设置展示框的背景颜色 */
    text-align: center; /* 居中对齐内容 */
    line-height: 50px; /* 设置行高，使内容垂直居中 */
    text-indent: -900px;
    /* padding-left: 200px; */
  }
</style>