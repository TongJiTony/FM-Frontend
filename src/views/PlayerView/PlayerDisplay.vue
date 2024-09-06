<template>
  <div class="player-display">
    <el-card shadow="always">
      <!-- 第一层：球员图片，ID/名字/生日，球队，惯用脚 -->
      <el-row :gutter="20">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span style="font-size: 20px; font-weight: bold">球员简介</span>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-arrow-left"
              @click="goBack"
              class="back-button"
              >返回</el-button
            >
          </div>
          <el-col :span="6">
            <div>
              <img
                :src="player[0].ICON"
                alt="Player Image"
                class="card-image"
              />
            </div>
          </el-col>
          <h2 style="font-size: 24px">{{ player[0].PLAYER_NAME }}</h2>
          <el-col :span="18" class="player-info">
            <el-row :gutter="12">
              <el-col :span="12">
                <div style="height: 60px; line-height: 60px">
                  <strong>球员编号:</strong>
                  <span style="margin-right: 10px"></span>
                  <el-tag type="info" style="font-size: 14px">{{
                    player[0].PLAYER_ID
                  }}</el-tag>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="height: 60px; line-height: 60px">
                  <strong>所在球队:</strong>
                  <span style="margin-right: 10px"></span>
                  <span style="margin-right: 10px; vertical-align: middle">
                    <el-tag type="info" style="font-size: 14px">{{
                      player[0].TEAM_NAME
                    }}</el-tag>
                    <img
                      :src="teamURL"
                      alt="球员头像"
                      style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        vertical-align: middle;
                      "
                    />
                  </span>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="height: 60px; line-height: 60px">
                  <strong>生日:</strong>
                  <span style="margin-right: 10px"></span>
                  <el-tag type="info" style="font-size: 14px"
                    >{{ player[0].BIRTHDAY }} ({{
                      calculateAge(player[0].BIRTHDAY)
                    }}岁)</el-tag
                  >
                </div>
              </el-col>
              <el-col :span="12">
                <div style="height: 60px; line-height: 60px">
                  <strong>惯用脚:</strong>
                  <span style="margin-right: 10px"></span>
                  <el-tag type="info" style="font-size: 14px">{{
                    player[0].USED_FOOT === 1 ? "右脚" : "左脚"
                  }}</el-tag>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-card>
      </el-row>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="作战能力" name="first">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-card class="module-card2" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>{{ player[0].ROLE }}</span>
                </div>
                <img
                  :src="fieldImageUrl"
                  alt="Football Field"
                  class="field-image"
                />
                <div class="player-position"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="module-card2" shadow="never">
                <div class="card-content">
                  <div class="team-avg-rank">
                    <div class="rank-info">
                      <span>队伍平均评分</span>
                    </div>
                    <div class="rank-progress">
                      <el-progress
                        type="circle"
                        :percentage="avgRank"
                        :format="formatTeam"
                      ></el-progress>
                    </div>
                  </div>
                  <div class="player-rank">
                    <div class="rank-info">
                      <span>个人评分</span>
                    </div>
                    <div class="rank-progress">
                      <el-progress
                        type="circle"
                        :percentage="player[0].RANK"
                        :format="formatPlayer"
                      ></el-progress>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="医疗记录" name="second">
          <el-card shadow="hover">
            <h2 v-if="player[0].HEALTH_STATE">健康状况：受伤</h2>
            <h2 v-else>健康状况：健康</h2>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                prop="HURT_PART"
                label="受伤部位"
              ></el-table-column>
              <el-table-column
                prop="MEDICAL_CARE"
                label="医疗建议"
              ></el-table-column>
              <el-table-column label="受伤天数">
                <template slot-scope="scope">
                  <span
                    >{{
                      calculateDaysDifference(
                        scope.row.HURT_TIME,
                        scope.row.PRED_REC_DATE
                      )
                    }}
                    天</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="所在阵容" name="third">
          <el-card shadow="never">
            <h2 v-if="player[0].GAME_STATE">比赛状态：允许出场</h2>
            <h2 v-else>比赛状态：禁赛</h2>
            <el-table :data="lineupData" style="width: 100%">
              <el-table-column prop="NOTE" label="阵容名称"></el-table-column>
              <el-table-column label="位置">{{
                player[0].ROLE
              }}</el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="转会记录" name="forth">
          <el-card shadow="never">
            <h2>转会记录</h2>
            <el-table :data="transferData" style="width: 100%" height="120">
              <el-table-column
                prop="TEAM_ID_FROM"
                label="转出球队"
              ></el-table-column>
              <el-table-column
                prop="TEAM_ID_TO"
                label="转入球队"
              ></el-table-column>
              <el-table-column
                prop="TRANSFER_FEES"
                label="转会费"
              ></el-table-column>
              <el-table-column
                prop="TRANSFER_DATE"
                label="转会日期"
              ></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      transferData: [],
      lineupData: [],
      tableData: [],
      allData: [],
      loading: true,
      player: null,
      teamURL: "",
      fieldImageUrl: "",
      players: [],
      avgRank: 0,
      activeTab: "first", // 默认打开的标签页名称
      PLAYER_ID: "", // 球员ID，必须要有
      PLAYER_NAME: "", // 球员姓名
      BIRTHDAY: "", // 出生日期
      TEAM_ID: "", // 队伍ID
      TEAM_NAME: "", // 队伍名称
      ROLE: "", // 球员位置
      USED_FOOT: 0, // 惯用脚
      HEALTH_STATE: 0, // 健康状态
      RANK: 0, // 球员等级
      GAME_STATE: 0, // 场上状态
      TRANS_STATE: 0, // 转会状态
      IS_SHOW: 1, // 展示状态
      ICON: "",
    };
  },
  created() {
    this.fetchTransferRecords();
    this.fetchLineupRecords();
    this.fetchPlayerData();
    this.fetchMedicalRecords();
  },
  methods: {
    getAverageRank(teamId) {
      axios
        .get(`/api/v1/player/displayall?teamid=${teamId}`)
        .then((response) => {
          console.log("Received data:", response.data);
          this.players = response.data;

          // 计算RANK之和
          let rankSum = 0;
          for (let player of this.players) {
            rankSum += player.RANK;
          }
          // 计算平均值
          this.avgRank = rankSum / this.players.length;
          console.log("Average RANK:", this.avgRank);
        })
        .catch((error) => {
          console.error("Failed to fetch player list for team:", error);
        });
    },
    formatPlayer() {
      return `${this.player[0].RANK.toFixed(1)}分`;
    },
    formatTeam() {
      return `${this.avgRank.toFixed(1)}分`;
    },
    calculateAge(birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },

    calculateDaysDifference(hurtTime, recoveryDate) {
      const hurtDate = new Date(hurtTime).setHours(0, 0, 0, 0);
      const recovery = new Date(recoveryDate).setHours(0, 0, 0, 0);
      const difference = (recovery - hurtDate) / (1000 * 60 * 60 * 24); // 转换为天数
      return difference;
    },

    fetchTransferRecords() {
      const playerId = this.$route.params.playerId;
      if (playerId) {
        axios
          .get(`/api/v1/transfer/displayall?playerid=${playerId}`)
          .then((response) => {
            console.log("Received transfer data:", response.data);
            this.transferData = response.data.sort(
              (a, b) => a.transfer_id - b.transfer_id
            );
          })
          .catch((error) => {
            console.error("Failed to fetch transfer list:", error);
          });
      }
    },

    fetchLineupRecords() {
      const playerId = this.$route.params.playerId;
      if (playerId) {
        axios
          .get(`/api/v1/lineup/displayall?playerid=${playerId}`)
          .then((response) => {
            this.lineupData = response.data.sort(
              (a, b) => a.LINEUP_ID - b.LINEUP_ID
            );
            console.log("Received lineup data:", this.lineupData);
          })
          .catch((error) => {
            console.error("Failed to fetch lineup list:", error);
          });
      }
    },

    fetchMedicalRecords() {
      const playerId = this.$route.params.playerId;
      if (playerId) {
        axios
          .get(`/api/v1/medical/displayall?playerid=${playerId}`)
          .then((response) => {
            console.log("Received data:", response.data);
            this.tableData = response.data.sort(
              (a, b) => a.MEDICAL_ID - b.MEDICAL_ID
            );
            this.allData = [...this.tableData];
          })
          .catch((error) => {
            console.error("Failed to fetch medical list for team:", error);
          });
      }
    },

    fetchPlayerData() {
      const playerId = this.$route.params.playerId;
      console.log("Fetching data for player ID:", playerId);
      axios
        .get(`/api/v1/player/displayone?playerid=${playerId}`)
        .then((response) => {
          console.log("Received data:", response.data);
          this.player = response.data;
          this.fetchTeamData();
          const role = this.player[0].ROLE;
          //console.log("Player Role:", role);
          this.fieldImageUrl = this.getImageUrlByRole(role);
          //console.log("Field Image URL:", this.fieldImageUrl);
          this.loading = false;
        })
        .catch((error) => {
          console.error("Failed to fetch player data:", error);
          this.loading = false;
        });
    },

    getImageUrlByRole(role) {
      switch (role) {
        case "守门员":
          return "https://s21.ax1x.com/2024/09/04/pAZAJ78.png";
        case "后卫":
          return "https://s21.ax1x.com/2024/09/04/pAZAufH.png";
        case "中场":
          return "https://s21.ax1x.com/2024/09/04/pAZAl6I.png";
        case "前锋":
          return "https://s21.ax1x.com/2024/09/04/pAZA1Xt.png";
        default:
          return "https://i.ibb.co/2jL5H73/playground.jpg";
      }
    },
    fetchTeamData() {
      const teamID = this.player[0].TEAM_ID;
      console.log("Fetching data for team ID:", teamID);
      axios
        .get(`/api/v1/team/displayone?Teamid=${teamID}`)
        .then((response) => {
          console.log("Received data:", response.data);
          const team = response.data;
          this.teamURL = team[0].TEAM_ICON;
          this.getAverageRank(teamID);
          console.log("URL:", this.teamURL);
        })
        .catch((error) => {
          console.error("Failed to fetch team data:", error);
        });
    },
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
  },
};
</script>

<style scoped>
.player-display {
  padding: 1rem;
}
.player-info {
  display: flex;
  flex-wrap: wrap;
  height: 150px;
}
.module-card {
  width: 300px;
  height: 300px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.module-card2 {
  width: 600px;
  height: 300px;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  text-align: center;
}

.medical-card {
  height: auto;
  overflow-y: auto;
}

.medical-records-container {
  display: flex;
  flex-direction: column;
  font-size: 12px; /* 字体更小 */
}

.medical-record {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background-color: #f9f9f9;
}

.medical-record p {
  margin: 2px 0;
  font-size: 10px; /* 更小的字体 */
}

.el-divider {
  margin: 10px 0;
}

.field-image {
  width: 100%;
  height: auto;
}

.player-position {
  position: absolute;
  background-color: red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.card-image {
  width: 60%;
  height: 190px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.team-image {
  width: 100px; /* 容器宽度 */
  height: 100px; /* 容器高度 */
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.team-logo {
  width: 50%; /* 图像宽度 */
  height: 50%; /* 图像高度 */
  object-fit: cover; /* 保持图像比例，剪裁多余部分 */
}
.back-button {
  float: right;
  margin-left: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.module-card2 .card-content {
  display: flex;
  justify-content: space-between;
}

.module-card2 .team-avg-rank,
.module-card2 .player-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 40px; /* 添加水平间距 */
}

.module-card2 .rank-info {
  margin-bottom: 10px;
}
</style>
