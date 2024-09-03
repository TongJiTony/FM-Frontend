<template>
  <el-card class="display-card1">
 <el-container style="height: 550px; border: 1px solid #eee">
    <el-aside
      round
      width="160px"
      style="background-color: rgb(238, 241, 246)"
      title="训练内容"
    >
      <p style="text-align: center; font-size: larger; color: gray; font-weight: bold;">训练列表</p>
      <el-menu>
        <el-menu-item
          v-for="(item, index) in filteredTrainingData"
          :key="item.TRAINING_ID"
          :class="{ 'is-active': selectedIndex === index }"
          @click="selectItem(index)"
        >
          {{ item.TRAIN_FOCUS }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container >
      <el-card style="width:100%;">

      
     
        <el-row type="flex" justify="space-between">
  <!-- 文字列 -->
  <el-col :span="20" style="text-align: left; font-size: 20px;">
    <span v-if="teamName" :style="{ color: '#6A5ACD', fontWeight: 'bold' }">{{ teamName }}</span>
    <span v-else :style="{ color: '#6A5ACD', fontWeight: 'bold' }">所有球队</span>
    训练表
  </el-col>

  <!-- 按钮列 -->
  <el-col :span="4" style="text-align: right;">
    <el-button type="primary" icon="el-icon-arrow-left" @click="goback" size="small">返回</el-button>
  </el-col>
</el-row>
     

        <div
          v-if="trainingData.length === 0"
          class="empty-message"
        >
          当前训练信息为空，请使用添加按钮新增训练信息
        </div>
        <div v-else>
          <el-row type="flex" justify="space-between">
  <!-- 按钮组 -->
  <div style="display: flex;">
    <el-button type="primary" @click="handleAdd" class="small-height-button" size="small">新增</el-button>
    <el-button type="primary" @click="handleDelete" class="small-height-button" size="small">删除</el-button>
  </div>

  <!-- 选择器组 -->
  <div class='el-input-group' style="display: flex; width: 30%;">
    <el-select
      v-model="selectedColumn"
      placeholder="选择列"
      style="width: 40%;"
    >
      <el-option
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :value="column.prop"
      >
      </el-option>
    </el-select>
    <el-select v-model="searchQuery" clearable style="width: 60%;">
      <el-option
        v-for="option in getOptions(selectedColumn)"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
      </el-option>
    </el-select>
  </div>
</el-row>

          <div v-if="filteredTrainingData.length === 0" class="empty-message">
                <el-empty
                  description="没有找到符合条件的训练信息"
                  :image="require('@/assets/img/itemNOTfound/itemNOTfound.jpeg')"
                  :image-size="400"
                ></el-empty>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">战术重点</h3>
                  <p style="font-size: 25px">{{ this.filteredTrainingData[selectedIndex].TRAIN_FOCUS }}</p>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">训练强度</h3>
                  <el-tag style="font-size: 20px; padding: 10px 20px 40px 20px;"
                    :type="getTagType(this.filteredTrainingData[selectedIndex].TRAIN_INTENSION)"
                  >
                    {{ this.filteredTrainingData[selectedIndex].TRAIN_INTENSION }}
                  </el-tag>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">训练评分</h3>
                  <el-progress
                    type="circle"
                    :percentage="this.filteredTrainingData[selectedIndex].TRAIN_SCORE"
                    :format="formatPercentage"
                    :width="100"
                  ></el-progress>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">战术阵型</h3>
                  <!-- <p style="font-size: 25px">{{ this.filteredTrainingData[selectedIndex].TEAM_FORMATION }}</p> -->
                  <img :src="getImageUrl" alt="Team Formation" class="team-formation-img"/>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">训练场地</h3>
                  <el-tag type="success" style="font-size: 20px; padding: 10px 20px 40px 20px;">
                    {{ this.stadiumName }}
                  </el-tag>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="display-card">
                  <h3 class="title">球队熟悉度</h3>
                  <el-progress
                    type="circle"
                    :percentage="this.filteredTrainingData[selectedIndex].TEAM_FAMILIARITY"
                    :format="formatPercentage"
                    :width="100"
                  ></el-progress>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </el-container>

    <!-- Add dialog -->
    <el-dialog title="新增训练" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="战术重点" :label-width="formLabelWidth" prop="TRAIN_FOCUS">
          <el-select v-model="form.TRAIN_FOCUS" placeholder="请选择战术重点">
            <el-option label="控球游戏" value="控球游戏"></el-option>
            <el-option label="快速反击" value="快速反击"></el-option>
            <el-option label="长传反击" value="长传反击"></el-option>
            <el-option label="防守反击" value="防守反击"></el-option>
            <el-option label="外侧" value="外侧"></el-option>
            <el-option label="长传球" value="长传球"></el-option>
            <el-option label="全攻全守" value="全攻全守"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="战术阵型" :label-width="formLabelWidth" prop="team_formation">
          <el-select v-model="form.team_formation" placeholder="请选择战术阵型">
            <el-option label="433" :value=433></el-option>
            <el-option label="4231" :value=4231></el-option>
            <el-option label="4321" :value=4321></el-option>
            <el-option label="4132" :value=4132></el-option>
            <el-option label="451" :value=451></el-option>
            <el-option label="442" :value=442></el-option>
            <el-option label="541" :value=541></el-option>
            <el-option label="352" :value=352></el-option>
            <el-option label="532" :value=532></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="训练评分" :label-width="formLabelWidth" prop="train_score">
          <el-slider v-model="form.train_score" :min="0" :max="100"></el-slider>
        </el-form-item>
        <el-form-item label="球队熟悉度" :label-width="formLabelWidth" prop="team_familiarity">
          <el-slider v-model="form.team_familiarity" :min="0" :max="100"></el-slider>
        </el-form-item>
        <el-form-item label="训练强度" :label-width="formLabelWidth" prop="train_intension">
          <el-select v-model="form.train_intension" placeholder="请选择训练强度">
            <el-option label="高强度" value="高强度"></el-option>
            <el-option label="均衡" value="均衡"></el-option>
            <el-option label="恢复训练" value="恢复训练"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="训练场地编号" :label-width="formLabelWidth" prop="train_stadium_id">
          <el-button type="info" plain @click="showStadiumDrawer">
            <div v-if="form.train_stadium_id">
              球场 ID: {{ form.train_stadium_id }}
            </div>
            <div v-else>
              请选择球场
            </div>
          </el-button>
        </el-form-item>
        <el-form-item label="球队编号" :label-width="formLabelWidth" prop="train_team_id">
          <el-input 
            v-model.number="form.train_team_id" 
            type="number"
            :placeholder="this.$route.params.teamId || ''"
            :disabled="!!this.$route.params.teamId"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Stadium Drawer -->
    <el-drawer title="选择场地" :visible.sync="stadiumDrawerVisible" direction="rtl" size="30%">
      <!-- 这里可以放置选择场地的内容 -->
      <el-row :gutter="20">
          <el-col
            :span="24"
            v-for="stadium in stadiumData"
            :key="stadium.TEAM_ID"
          >
            <el-card
              @click.native="selectStadium(stadium)"
              style="cursor: pointer;"
            >
              <p>{{ stadium.STADIUM_NAME }}</p>
            </el-card>
        </el-col>
      </el-row>
     </el-drawer>

  </el-container>
  </el-card>

 
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
      stadiumName: '',
      teamName: '',  // 球队名称
      dialogVisible: false,
      form: {  // Add表单数据
        TRAIN_FOCUS: '',
        team_formation: null,
        train_score: 50,
        team_familiarity: 50,
        train_intension: '',
        train_stadium_id: null,
        train_team_id: null
      },
      formLabelWidth: '140px',
      rules: {
        train_team_id: [
          { required: true, message: '请输入train_team_id', trigger: 'blur' },
          { type: 'number', message: 'train_team_id必须为数字值', trigger: 'blur' }
        ]
      },

      stadiumDrawerVisible: false, // 选择场地  抽屉可见性控制
      stadiumData: [], // 场地数据
      selectedStadium: null, // Add选中的场地

      // 搜索框
      searchQuery: '',
      selectedColumn: '', // 默认选中的列
      columns: [
        { prop: 'TRAIN_FOCUS', label: '战术重点' },
        { prop: 'TEAM_FORMATION', label: '战术阵型' },
        { prop: 'TRAIN_INTENSION', label: '训练强度' },
        // { prop: 'TRAIN_STADIUM_ID', label: '训练场地'},
      ],
      //stadiumOptions: [], // 用于存储球场选项
    };
  },
  watch: {
    selectedColumn() {
      this.searchQuery = '';
    }
  },
  created () {
    this.selectedColumn = this.columns[0].prop;
  },
  async mounted () {
    await this.fetchtrainingData();
    this.getStadium();
    //this.getALLStadiumOptions(); // 获取球场选项
  },
  computed: {
    filteredTrainingData () {
      if (!this.selectedColumn || this.searchQuery === '') 
        return this.trainingData;
      
      return this.trainingData.filter((item) => {
        return String(item[this.selectedColumn]).toLowerCase().includes(String(this.searchQuery).toLowerCase());
      });
    },
    getImageUrl() {
      const teamFormation = this.filteredTrainingData[this.selectedIndex]?.TEAM_FORMATION;
      if (teamFormation) {
        console.log(teamFormation);
        return require(`@/assets/img/teamFormation/${teamFormation}.webp`);
      }
      return ''; // 返回默认图片或空字符串
    },
  },
  methods: {
    async fetchtrainingData () {
      this.loading = true;
      let apiUrl = '/api/v1/training/displayall';
      if (this.$route.params.teamId) {
        apiUrl += `?teamid=${this.$route.params.teamId}`;
      }
      try {
        const response = await axios.get(apiUrl);
        this.trainingData = response.data;
        //console.log("the data is ", this.trainingData);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
      this.getTeamName();
      //console.log("get the team name");
    },
    selectItem (index) {
      this.selectedIndex = index;
      this.getStadium();
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
    getStadium () {
      axios.get(`/api/v1/stadium/displayone?StadiumId=${this.trainingData[this.selectedIndex].TRAIN_STADIUM_ID}`)
        .then((response) => {
          this.stadiumName = response.data[0].STADIUM_NAME;
          //console.log("the stadium name is ", this.stadiumName);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTeamName () {
      if (this.$route.params.teamId) {
        axios.get(`/api/v1/team/displayone?TeamId=${this.$route.params.teamId}`)
          .then((response) => {
            this.teamName = response.data[0].TEAM_NAME;  //response.data是一个只有一个元素的数组
            //console.log("the team name is ", this.teamName);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    handleDelete () {
      this.$confirm('确定删除当前数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/v1/training/delete?trainingid=${this.trainingData[this.selectedIndex].TRAINING_ID}`)
          .then(response => {
            if (response.status === 204) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.trainingData.splice(this.selectedIndex, 1);
              this.selectedIndex = 0;
            }
          }).catch(error => {
            console.error('Error deleting lineup:', error);
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAdd () {
      this.dialogVisible = true;
    },
    saveAdd () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 处理表单提交的逻辑
          console.log(this.form);
          this.dialogVisible = false;
          axios.post('/api/v1/training/add', this.form)
            .then(response => {
              if (response.status === 201) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                });
                this.addDialogVisible = false;
                this.fetchtrainingData();   //there may be more effective way to do this
                //this.$set(this.lineupData, this.lineupData.length, lineup);
              }
            })
            .catch(error => {
              console.error('Error adding lineup:', error);
              this.$message({
                type: 'error',
                message: '添加失败!'
              });
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    validateTrainIntension(rule, value, callback) {
      if (!['均衡', '高强度', '恢复训练'].includes(value)) {
        callback(new Error('train_intension内容必须为“均衡”、“高强度”或“恢复训练”'));
      } else {
        callback();
      }
    },
    showStadiumDrawer() {
      this.stadiumDrawerVisible = true;
      this.fetchStadiumData();
    },
    fetchStadiumData() {
      axios.get('/api/v1/stadium/displayall')
        .then(response => {
          this.stadiumData = response.data;
          console.log('Stadium data:', this.stadiumData);
        })
        .catch(error => {
          console.error('Error fetching stadium data:', error);
        });
    },
    selectStadium(stadium) {
      this.form.train_stadium_id = stadium.STADIUM_ID;
      this.stadiumDrawerVisible = false;
      console.log('Selected stadium ID:', this.form.train_stadium_id);
    },
    handleInputFocus() {  // 当输入框获得焦点时触发 选择球队进行输入
      if (!this.$route.params.teamId) {
        this.getTeamNames().then(suggestions => {
          // 这里假设你通过 API 获取的团队名称列表并进行处理
          this.$refs.teamInput.suggestions = suggestions;
        });
      }
    },
    getTeamNames() {  // 获取球队名称
      return new Promise((resolve, reject) => {
        axios.get('/api/v1/team/displayall')
          .then(response => {
            // 假设返回的数据是一个包含 teamName 的数组
            const suggestions = response.data.map(team => team.teamName);
            resolve(suggestions);
          })
          .catch(error => {
            console.error('Error fetching team names:', error);
            reject(error);
          });
      });
    },
    goback () {  // 返回上级页面
      window.sessionStorage.clear();
      this.$router.go(-1);
    },

    // 搜括框设置标签
    getOptions(selectedColumn) {
      switch (selectedColumn) {
        case 'TRAIN_FOCUS':
          return [
            { value: '控球游戏', label: '控球游戏' },
            { value: '快速反击', label: '快速反击' },
            { value: '长传反击', label: '长传反击' },
            { value: '防守反击', label: '防守反击' },
            { value: '外侧', label: '外侧' },
            { value: '长传球', label: '长传球' },
            { value: '全攻全守', label: '全攻全守' },
          ];
        case 'TEAM_FORMATION':
          return [
            { value: 433, label: '433' },
            { value: 4231, label: '4231' },
            { value: 4321, label: '4321' },
            { value: 4132, label: '4132' },
            { value: 451, label: '451' },
            { value: 442, label: '442' },
            { value: 541, label: '541' },
            { value: 352, label: '352' },
            { value: 532, label: '532' },
          ];
        case 'TRAIN_INTENSION':
          return [
            { value: "高强度", label: '高强度' },
            { value: "均衡", label: '均衡' },
            { value: "恢复训练", label: '恢复训练' },
          ];
        case 'TRAIN_STADIUM_ID':
          return [
            
          ]
        default:
          return [];
      }
    },
    // getALLStadiumOptions() {
    //   axios.get('/api/v1/stadium/displayall')
    //     .then((response) => {
    //       this.stadiumOptions = response.data.map(stadium => ({
    //         value: stadium.STADIUM_ID,
    //         label: stadium.STADIUM_NAME
    //       }));
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
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
.display-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
}
.display-card1 {
    height: 600px;
}
.title {
  position: absolute;
  top: 0;
  left: 10px;
}
.team-formation-img {
  width: 53%;
  height: auto;
  margin: 0 auto 0 30%; /* 调整左边距 */
}

.small-height-button {
  height: 32px; /* 根据需要调整高度 */
  line-height:32px; /* 根据需要调整行高 */
  padding: 0 20px; /* 根据需要调整内边距 */
}

</style>
