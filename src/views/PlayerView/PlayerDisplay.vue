<template>
  <div class="player-display">
    <el-card shadow="always">
      <!-- 第一层：球员图片，ID/名字/生日，球队，惯用脚 -->
      <el-row :gutter="20" class="top-layer">
        <!-- 球员图片 -->
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <img :src="player[0].ICON" alt="Player Image" class="card-image" />
          </el-card>
        </el-col>

        <!-- ID，名字，生日 -->
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <el-row class="info-row">
              <el-col :span="12">
                <el-tag type="info">{{ player[0].PLAYER_ID }}</el-tag>
              </el-col>
              <el-col :span="12">
                <el-tag type="info">{{ player[0].PLAYER_NAME }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-tag type="info"
                  >{{ player[0].BIRTHDAY }} ({{
                    calculateAge(player[0].BIRTHDAY)
                  }}
                  岁)</el-tag
                >
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <!-- 球队 -->
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>球队</span>
            </div>
            <el-row>
              <el-col :span="24">
                <el-tag type="info">{{ player[0].TEAM_NAME }}</el-tag>
              </el-col>
              <el-col>
                <img
                  src="https://img.51miz.com/Element/00/91/85/34/422e1064_E918534_f98a4621.png"
                  alt="Team Image"
                  class="team-logo"
                />
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <!-- 惯用脚 -->
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>惯用脚</span>
            </div>
            <el-tag type="info">{{
              player[0].USED_FOOT === 1 ? "Right Foot" : "Left Foot"
            }}</el-tag>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分隔线 -->
      <el-divider></el-divider>

      <!-- 第二层：球场和评分 -->
      <el-row :gutter="20" class="middle-layer">
        <!-- 球场 -->
        <el-col :span="12">
          <el-card class="module-card2" shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ player[0].ROLE }}</span>
            </div>
            <img src="imageUrl" alt="Football Field" class="field-image" />
            <div class="player-position" :style="positionStyle"></div>
          </el-card>
        </el-col>

        <!-- 评分 -->
        <el-col :span="12">
          <el-card class="module-card2" shadow="hover">
            <div slot="header" class="clearfix">
              <span>评分</span>
            </div>
            <el-progress
              type="circle"
              :percentage="player[0].RANK"
            ></el-progress>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分隔线 -->
      <el-divider></el-divider>

      <!-- 第三层：医疗，阵容，比赛，转会 -->
      <el-row :gutter="20" class="bottom-layer">
        <el-col :span="6">
          <el-card class="module-card3" shadow="hover">
            <p>Medical</p>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-if="tableData.length"
              height="120"
            >
              <el-table-column
                prop="MEDICAL_ID"
                label="ID"
                width="80"
              ></el-table-column>
              <el-table-column
                prop="HURT_PART"
                label="受伤部位"
              ></el-table-column>
              <el-table-column
                prop="MEDICAL_CARE"
                label="医疗建议"
              ></el-table-column>
              <el-table-column label="受伤天数" width="120">
                <template slot-scope="scope">
                  <span
                    >{{
                      calculateDaysDifference(
                        scope.row.HURT_TIME,
                        scope.row.PRED_REC_DATE
                      )
                    }}
                    days</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <p v-else>No medical records found for this player.</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card3" shadow="hover">
            <p>Line-up</p>
            <el-table
              :data="lineupData"
              style="width: 100%"
              v-if="lineupData.length"
              height="120"
            >
              <el-table-column
                prop="LINEUP_ID"
                label="ID"
                width="80"
              ></el-table-column>
              <el-table-column prop="TEAM_NAME" label="球队"></el-table-column>
              <el-table-column
                prop="NOTE"
                label="备注"
                width="100"
              ></el-table-column>
            </el-table>
            <p v-else>No lineup records found for this player.</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card3" shadow="hover">
            <p>Match</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card3" shadow="hover">
            <p>Transfer</p>
            <el-table
              :data="transferData"
              style="width: 100%"
              v-if="transferData.length"
              height="120"
            >
              <el-table-column
                prop="transfer_id"
                label="ID"
                width="60"
              ></el-table-column>
              <el-table-column
                prop="team_id_from"
                label="From"
              ></el-table-column>
              <el-table-column prop="team_id_to" label="To"></el-table-column>
              <el-table-column
                prop="transfer_fees"
                label="Fees"
              ></el-table-column>
              <el-table-column
                prop="transfer_date"
                label="Date"
              ></el-table-column>
            </el-table>
            <p v-else>No transfer records found for this player.</p>
          </el-card>
        </el-col>
      </el-row>
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
      imageUrl: "https://i.ibb.co/2jL5H73/playground.jpg", // 默认图片
      loading: true,
      player: null,
    };
  },
  watch: {
    "player[0].ROLE": {
      immediate: true,
      handler(newRole) {
        this.updateImageUrl(newRole);
      },
    },
  },
  created() {
    this.fetchTransferRecords();
    this.fetchLineupRecords();
    this.fetchPlayerData();
    this.fetchMedicalRecords();
  },
  methods: {
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
            console.log("Received lineup data:", response.data);
            this.lineupData = response.data.sort(
              (a, b) => a.LINEUP_ID - b.LINEUP_ID
            );
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
          this.updatePositionStyle(); // 调用方法更新positionStyle
          this.loading = false;
        })
        .catch((error) => {
          console.error("Failed to fetch player data:", error);
          this.loading = false;
        });
    },
    updateImageUrl(role) {
      switch (role) {
        case "F":
          this.imageUrl = "https://i.ibb.co/xyz/forward.jpg"; // 前锋位置图片
          break;
        case "M":
          this.imageUrl = "https://i.ibb.co/xyz/midfielder.jpg"; // 中场位置图片
          break;
        case "B":
          this.imageUrl = "https://i.ibb.co/xyz/defender.jpg"; // 后卫位置图片
          break;
        case "GK":
          this.imageUrl = "https://i.ibb.co/xyz/goalkeeper.jpg"; // 守门员位置图片
          break;
        default:
          this.imageUrl = "https://i.ibb.co/2jL5H73/playground.jpg"; // 默认图片
      }
    },
  },
};
</script>

<style scoped>
.player-display {
  padding: 1rem;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.module-card3 {
  width: 400px;
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

.el-row {
  margin-bottom: 20px;
}

.card-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
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
</style>
