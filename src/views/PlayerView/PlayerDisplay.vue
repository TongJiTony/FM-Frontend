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
                <el-tag type="info">{{ player[0].BIRTHDAY }}</el-tag>
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
            <el-tag type="info">{{ player[0].TEAM_NAME }}</el-tag>
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
            <img
              src="https://i.ibb.co/2jL5H73/playground.jpg"
              alt="Football Field"
              class="field-image"
            />
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
          <el-card class="module-card medical-card" shadow="hover">
            <p>Medical</p>
            <!-- 横向排列医疗记录 -->
            <div class="medical-records-container" v-if="tableData.length">
              <div
                v-for="record in tableData"
                :key="record.MEDICAL_ID"
                class="medical-record"
              >
                <p>ID: {{ record.MEDICAL_ID }}</p>
                <p>Hurt: {{ record.HURT_PART }}</p>
                <p>Time: {{ record.HURT_TIME }}</p>
                <p>Care: {{ record.MEDICAL_CARE }}</p>
                <p>State: {{ record.STATE }}</p>
                <p>Recovery: {{ record.PRED_REC_DATE }}</p>
              </div>
            </div>
            <p v-else>No medical records found for this player.</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <p>Line-up</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <p>Match</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="module-card" shadow="hover">
            <p>Transfer</p>
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
      tableData: [],
      allData: [],
      positionStyle: {
        position: "absolute",
        top: "50%", // Adjust based on player role/position
        left: "20%", // Adjust based on player role/position
        transform: "translate(-50%, -50%)",
        width: "20px",
        height: "20px",
        backgroundColor: "red",
        borderRadius: "50%",
      },
      loading: true,
      player: null,
    };
  },
  created() {
    this.fetchPlayerData();
    this.fetchMedicalRecords();
  },
  methods: {
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
    updatePositionStyle() {
      if (this.player && this.player[0].ROLE) {
        switch (this.player[0].ROLE) {
          case "F":
            this.positionStyle.left = "30%"; // Example value for forward
            break;
          case "WB":
            this.positionStyle.left = "21%"; // Example value for midfielder
            break;
          case "B":
            this.positionStyle.left = "10%"; // Example value for defender
            break;
          case "GK":
            this.positionStyle.left = "7%"; // Example value for goalkeeper
            break;
          default:
            this.positionStyle.left = "20%"; // Default or unknown role
        }
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
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
}

.info-row {
  display: flex;
  justify-content: space-between;
}
</style>
