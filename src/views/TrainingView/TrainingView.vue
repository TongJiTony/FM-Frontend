<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside
      width="200px"
      style="background-color: rgb(238, 241, 246)"
    >
      <el-menu>
        <el-menu-item
          v-for="(item, index) in trainingData"
          :key="item.TRAINING_ID"
          :class="{ 'is-active': selectedIndex === index }"
          @click="selectItem(index)"
        >
          {{ item.TRAINING_ID }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-row>
          <el-col
            :span="12"
            style="text-align: left; font-size: 20px"
          >
            球队训练表
          </el-col>
          <el-col :span="12">
            <el-dropdown>
              <i
                class="el-icon-setting"
                style="margin-right: 15px"
              ></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>这里输出球队名称</span>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <div
          v-if="trainingData.length === 0"
          class="empty-message"
        >
          当前训练信息为空
        </div>
        <div v-else>
          <el-row :gutter="20">
            <!-- 文字信息 -->
            <el-col :span="4">
              <el-card>
                <h4>训练目标</h4>
                <p>{{ this.trainingData[selectedIndex].TRAIN_FOCUS }}</p>
              </el-card>
              <el-card style="margin-top: 20px;">
                <h4>战术重点</h4>
                <p>{{ this.trainingData[selectedIndex].TEAM_FORMATION }}</p>
              </el-card>
            </el-col>

            <!-- 枚举类型信息 -->
            <el-col :span="6">
              <el-card>
                <p>训练强度</p>
                <el-tag
                  :type="getTagType(this.trainingData[selectedIndex].TRAIN_INTENSION)"
                >
                  {{ this.trainingData[selectedIndex].TRAIN_INTENSION }}
                </el-tag>
              </el-card>

              <el-card>
                <p>训练场地</p>

              </el-card>
            </el-col>

            <!-- 百分比信息 -->
            <el-col :span="5">
              <el-card>
                <p>训练评分</p>
                <el-progress
                  type="circle"
                  :percentage="this.trainingData[selectedIndex].TRAIN_SCORE"
                  :format="formatPercentage"
                  :width="100"
                ></el-progress>
              </el-card>
              <el-card style="margin-top: 20px;">
                <p>球队熟悉度</p>
                <el-progress
                  type="circle"
                  :percentage="this.trainingData[selectedIndex].TEAM_FAMILIARITY"
                  :format="formatPercentage"
                  :width="100"
                ></el-progress>
              </el-card>
            </el-col>

          </el-row>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      loading: true,

      trainingData: [],
      selectedIndex: 0,
      activeNames: ['1'], // 默认打开的折叠项的 name
    };
  },
  created () {
    this.fetchtrainingData();

  },
  methods: {
    fetchtrainingData () {
      this.loading = true;
      let apiUrl = '/api/v1/training/displayall';
      if (this.$route.params.lineupId) {
        apiUrl += `?lineupId=${this.$route.params.lineupId}`;
      }
      console.log("the api url is ", apiUrl);
      axios.get(apiUrl)
        .then((response) => {
          this.trainingData = response.data;
          this.loading = false;
          console.log("the data is ", this.trainingData);
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    selectItem (index) {
      this.selectedIndex = index;
    },
    formatPercentage (percentage) { // 格式化百分比的输出
      return `${percentage}分`;
    },
    getTagType (intension) { // 根据训练强度返回标签类型
      switch (intension) {
        case '高强度':
          return 'danger';
        case '均衡':
          return 'warning';
        case '恢复训练':
          return 'success';
        default:
          return 'info';
      }
    },
  },
};
</script>

<style scoped>
.empty-message {
  color: #999; /* 文字颜色 */
  font-size: 16px; /* 字体大小 */
  text-align: center; /* 文字居中 */
  padding: 20px; /* 内边距 */
  border: 1px solid #ddd; /* 边框 */
  border-radius: 4px; /* 边框圆角 */
  background-color: #f9f9f9; /* 背景颜色 */
}
</style>
