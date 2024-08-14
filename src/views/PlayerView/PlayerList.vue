<template>
  <div class="player-list">
    <el-row :gutter="20" class="header-row" justify="end">
      <el-col :span="18">
        <el-button
          @click="openAddPlayerDialog"
          type="primary"
          size="small"
          style="margin-bottom: 1rem"
          >添加球员</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-input-group class="el-input-group">
          <el-select
            v-model="searchType"
            placeholder="选择搜索类型"
            size="small"
          >
            <el-option label="球员编号" value="PLAYER_ID"></el-option>
            <el-option label="姓名" value="PLAYER_NAME"></el-option>
            <el-option label="队伍" value="TEAM_NAME"></el-option>
            <el-option label="位置" value="ROLE"></el-option>
          </el-select>
          <el-input
            v-model="searchQuery"
            placeholder="输入搜索内容"
            size="small"
          ></el-input>
          <el-button @click="handleSearch" type="primary" size="small"
            >搜索</el-button
          >
          <el-button @click="resetSearch" type="text" size="small"
            >重置</el-button
          >
        </el-input-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="(player, index) in pagedData" :key="index" :span="12">
        <el-card shadow="always" class="player-card">
          <h3>{{ player.PLAYER_NAME }}</h3>
          <p><strong>球员编号:</strong> {{ player.PLAYER_ID }}</p>
          <p><strong>队伍:</strong> {{ player.TEAM_NAME }}</p>
          <p><strong>位置:</strong> {{ player.ROLE }}</p>
          <el-button @click="handleClick(player)" type="text" size="small"
            >详情</el-button
          >
          <el-button
            @click="confirmEdit(player)"
            type="text"
            size="small"
            style="color: blue"
            >编辑</el-button
          >
          <el-button
            @click="confirmDelete(player)"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- Confirm Delete Dialog -->
    <el-dialog
      title="确认删除"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <p>确定要删除球员 {{ selectedPlayer?.PLAYER_NAME }} 吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </span>
    </el-dialog>

    <!-- Edit Player Dialog -->
    <el-dialog
      title="修改球员信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="球员编号" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_ID" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.BIRTHDAY"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="队伍ID" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_ID"></el-input>
        </el-form-item>
        <el-form-item label="队伍" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-select v-model="editForm.ROLE" placeholder="选择位置">
            <el-option label="守门员 (GK)" value="GK"></el-option>
            <el-option label="后卫 (B)" value="B"></el-option>
            <el-option label="中场 (M)" value="M"></el-option>
            <el-option label="前锋 (F)" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="惯用脚" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.USED_FOOT">
            <el-radio :label="0">左脚</el-radio>
            <el-radio :label="1">右脚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.HEALTH_STATE">
            <el-radio :label="0">健康</el-radio>
            <el-radio :label="1">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input-number
            v-model="editForm.RANK"
            :min="0"
            :max="100"
            label="等级"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="场上状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.GAME_STATE">
            <el-radio :label="0">允许出场</el-radio>
            <el-radio :label="1">禁赛</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转会状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.TRANS_STATE">
            <el-radio :label="1">在转会</el-radio>
            <el-radio :label="0">不转会</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.IS_SHOW">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="球员图片" :label-width="formLabelWidth">
          <el-input v-model="editForm.ICON"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>

    <!-- Add Player Dialog -->
    <el-dialog
      title="添加球员"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="PLAYER_NAME"
        >
          <el-input v-model="addForm.PLAYER_NAME"></el-input>
        </el-form-item>
        <el-form-item
          label="出生日期"
          :label-width="formLabelWidth"
          prop="BIRTHDAY"
        >
          <el-date-picker
            v-model="addForm.BIRTHDAY"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="队伍ID"
          :label-width="formLabelWidth"
          prop="TEAM_ID"
        >
          <el-input v-model="addForm.TEAM_ID" type="number"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="ROLE">
          <el-select v-model="addForm.ROLE" placeholder="选择位置">
            <el-option label="守门员 (GK)" value="GK"></el-option>
            <el-option label="后卫 (B)" value="B"></el-option>
            <el-option label="中场 (M)" value="M"></el-option>
            <el-option label="前锋 (F)" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="惯用脚"
          :label-width="formLabelWidth"
          prop="USED_FOOT"
        >
          <el-radio-group v-model="addForm.USED_FOOT">
            <el-radio :label="0">左脚</el-radio>
            <el-radio :label="1">右脚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="健康状态"
          :label-width="formLabelWidth"
          prop="HEALTH_STATE"
        >
          <el-radio-group v-model="addForm.HEALTH_STATE">
            <el-radio :label="0">健康</el-radio>
            <el-radio :label="1">受伤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input-number
            v-model="addForm.RANK"
            :min="0"
            :max="100"
            label="等级"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="场上状态"
          :label-width="formLabelWidth"
          prop="GAME_STATE"
        >
          <el-radio-group v-model="addForm.GAME_STATE">
            <el-radio :label="0">允许出场</el-radio>
            <el-radio :label="1">禁赛</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="转会状态"
          :label-width="formLabelWidth"
          prop="TRANS_STATE"
        >
          <el-radio-group v-model="addForm.TRANS_STATE">
            <el-radio :label="0">不转会</el-radio>
            <el-radio :label="1">在转会</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="展示状态"
          :label-width="formLabelWidth"
          prop="IS_SHOW"
        >
          <el-radio-group v-model="addForm.IS_SHOW">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="球员图像：" prop="ICON">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :http-request="customUpload"
            :show-file-list="false"
          >
            <img v-if="addForm.icon" :src="addForm.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon">上传球员头像</i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddPlayer">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchType: "",
      searchQuery: "",
      pagedData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1, // Add this line to keep track of the current page
      dialogVisible: false,
      selectedPlayer: null,
      editDialogVisible: false,
      editForm: {
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
      },
      formLabelWidth: "100px",
      addDialogVisible: false,
      addForm: {
        PLAYER_NAME: "",
        BIRTHDAY: "",
        TEAM_ID: "",
        ROLE: "",
        USED_FOOT: 0,
        HEALTH_STATE: 0,
        RANK: 0,
        GAME_STATE: 0,
        TRANS_STATE: 0,
        IS_SHOW: 1,
        ICON: "https://s2.loli.net/2024/08/09/WaSdBU7j94w2JpI.jpg",
      },
      addFormRules: {
        PLAYER_NAME: [
          { required: true, message: "请输入球员姓名", trigger: "blur" },
        ],
        BIRTHDAY: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        TEAM_ID: [{ required: true, message: "请输入队伍ID", trigger: "blur" }],
        ROLE: [{ required: true, message: "请选择位置", trigger: "change" }],
        USED_FOOT: [
          { required: true, message: "请选择惯用脚", trigger: "change" },
        ],
        HEALTH_STATE: [
          { required: true, message: "请选择健康状态", trigger: "change" },
        ],
        RANK: [{ required: true, message: "请输入等级", trigger: "blur" }],
        GAME_STATE: [
          { required: true, message: "请选择场上状态", trigger: "change" },
        ],
        TRANS_STATE: [
          { required: true, message: "请选择转会状态", trigger: "change" },
        ],
        IS_SHOW: [
          { required: true, message: "请选择展示状态", trigger: "change" },
        ],
        ICON: [{ required: false, message: "请上传图片", trigger: "blur" }],
      },
      tableData: [],
      allData: [],
      uploadAction: "https://api.imgbb.com/1/upload",
      imgbbApiKey: "a18b4cdd1ea4b32881a598e7f32b854a",
      name: "playerimage",
      expirationTime: 604800, // 7 days in seconds
    };
  },
  methods: {
    customUpload(request) {
      if (request.file) {
        // 如果用户上传了图片，则执行上传逻辑
        const formData = new FormData();
        formData.append("image", request.file);

        axios
          .post(
            `${this.uploadAction}?key=${this.imgbbApiKey}&name=${this.name}&expiration=${this.expirationTime}`,
            formData
          )
          .then((response) => {
            const imageUrl = response.data.data.url;
            console.log("Returned URL:", response.data.data.url); // 打印图床返回的URL
            this.addForm.ICON = imageUrl;
            console.log("ICON field set to:", this.addForm.ICON);
            request.onSuccess(response.data);
          })
          .catch((error) => {
            console.log(error);
            request.onError(error);
          });
      }
    },

    handleAvatarSuccess(response) {
      console.log("response:", response);
      if (response && response.data && response.data.url) {
        this.deleteCurrentImageUrl();
        this.registerForm.icon = response.data.url;
        //this.currentDeleteUrl = response.data.delete_url;
        this.$message.info("图片加载成功！");
      } else {
        this.$message.error("图片上传失败，请重试！");
      }
    },
    handleAvatarError(error) {
      console.error("图片上传失败", error);
      this.$message.error("图片上传失败，请重试！");
    },
    beforeAvatarUpload(file) {
      const isPNGorJPG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPNGorJPG) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isPNGorJPG && isLt2M;
    },

    // Fetch players based on teamId or fetch all players
    fetchPlayers() {
      const teamId = this.$route.params.teamId;
      if (teamId) {
        console.log("Fetching data for team ID:", teamId);
        axios
          .get(`/api/v1/player/displayall?teamid=${teamId}`)
          .then((response) => {
            console.log("Received data:", response.data);
            this.tableData = response.data;
            this.allData = response.data;
            this.total = response.data.length;
            this.updatePagedData();
          })
          .catch((error) => {
            console.error("Failed to fetch player list for team:", error);
          });
      } else {
        console.log("Fetching all players");
        axios
          .get("/api/v1/player/displayall")
          .then((response) => {
            console.log("Received data:", response.data);
            this.tableData = response.data;
            this.allData = response.data;
            this.total = response.data.length;
            this.updatePagedData();
          })
          .catch((error) => {
            console.error("Failed to fetch player list:", error);
          });
      }
    },

    // Navigate to player detail page
    handleClick(player) {
      console.log("Navigating to player detail page for:", player.PLAYER_ID);
      const playerId = player.PLAYER_ID;
      const route = `/player-display/${playerId}`;
      this.$router.push(route);
    },

    // Open add player dialog
    openAddPlayerDialog() {
      console.log("Opening add player dialog");
      this.addDialogVisible = true;
    },

    // Handle closing of dialogs
    handleDialogClose() {
      console.log("Closing delete confirmation dialog");
      this.dialogVisible = false;
    },

    handleAddDialogClose() {
      console.log("Closing add player dialog");
      this.addDialogVisible = false;
    },

    handleEditDialogClose() {
      console.log("Closing edit dialog");
      this.editDialogVisible = false;
    },

    // Confirm deletion of a player
    confirmDelete(player) {
      console.log("Confirming delete for player:", player.PLAYER_NAME);
      this.selectedPlayer = player;
      this.dialogVisible = true;
    },

    // Delete player with correct API endpoint
    handleDelete() {
      console.log("Deleting player:", this.selectedPlayer.PLAYER_NAME);
      axios
        .delete(
          `/api/v1/player/delete?playerid=${this.selectedPlayer.PLAYER_ID}`
        ) //用delete方法！
        .then(() => {
          console.log("Player deleted successfully");
          this.fetchPlayers();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("Failed to delete player:", error);
        });
    },

    // Confirm editing of a player
    confirmEdit(player) {
      console.log("Opening edit dialog for player:", player.PLAYER_NAME);
      this.editForm = { ...player };
      this.editDialogVisible = true;
    },

    // Save edited player data with correct API endpoint
    handleSave() {
      console.log("Saving player data for:", this.editForm.PLAYER_NAME);

      // 构建符合服务器要求的完整 JSON 对象
      const updatedPlayerData = {
        PLAYER_NAME: this.editForm.PLAYER_NAME,
        BIRTHDAY: this.editForm.BIRTHDAY,
        TEAM_ID: this.editForm.TEAM_ID,
        ROLE: this.editForm.ROLE,
        USED_FOOT: this.editForm.USED_FOOT,
        HEALTH_STATE: this.editForm.HEALTH_STATE,
        RANK: this.editForm.RANK,
        GAME_STATE: this.editForm.GAME_STATE,
        TRANS_STATE: this.editForm.TRANS_STATE,
        IS_SHOW: this.editForm.IS_SHOW,
        ICON: this.editForm.ICON,
      };

      // 使用正确的 API 路径
      axios
        .post(
          `/api/v1/player/update?playerid=${this.editForm.PLAYER_ID}`,
          updatedPlayerData
        )
        .then(() => {
          console.log("Player updated successfully");
          this.fetchPlayers();
          this.updatePagedData(this.currentPage); // Ensure the correct page is displayed after data is fetched
          this.editDialogVisible = false;
        })
        .catch((error) => {
          console.error("Failed to update player:", error);
        });
    },

    // Add a new player
    handleAddPlayer() {
      console.log("Adding new player");
      console.log("Form data before validation:", this.addForm);
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          // Construct the JSON object as per server's expectations
          // Convert to number
          const newPlayerData = {
            PLAYER_NAME: this.addForm.PLAYER_NAME,
            BIRTHDAY: this.addForm.BIRTHDAY,
            TEAM_ID: Number(this.addForm.TEAM_ID),
            ROLE: this.addForm.ROLE,
            USED_FOOT: Number(this.addForm.USED_FOOT),
            HEALTH_STATE: Number(this.addForm.HEALTH_STATE),
            RANK: Number(this.addForm.RANK),
            GAME_STATE: Number(this.addForm.GAME_STATE),
            TRANS_STATE: Number(this.addForm.TRANS_STATE),
            IS_SHOW: Number(this.addForm.IS_SHOW),
            ICON: this.addForm.ICON,
          };
          console.log("New player data:", newPlayerData);

          // Use the correct API endpoint
          axios
            .post(`api/v1/player/add`, newPlayerData)
            .then(() => {
              console.log("Saving player info with image URL:", this.imageUrl);
              console.log("Player added successfully");
              this.fetchPlayers(); // 刷新玩家列表
              this.addDialogVisible = false; // 关闭对话框
            })
            .catch((error) => {
              if (error.response) {
                // 服务器返回的错误响应
                console.error("Failed to add player:", error.response.data);
              } else if (error.request) {
                // 请求已发出，但没有收到响应
                console.error("No response received:", error.request);
              } else {
                // 设置请求时出错
                console.error("Error setting up request:", error.message);
              }
            });
        }
      });
    },

    // Perform a search
    handleSearch() {
      console.log(
        "Performing search with type:",
        this.searchType,
        "and query:",
        this.searchQuery
      );
      const searchType = this.searchType;
      const searchQuery = this.searchQuery.toLowerCase();
      this.tableData = this.allData.filter((player) =>
        player[searchType].toString().toLowerCase().includes(searchQuery)
      );
      this.total = this.tableData.length;
      this.currentPage = 1;
      this.updatePagedData();
    },

    // Reset search criteria
    resetSearch() {
      console.log("Resetting search");
      this.searchType = "";
      this.searchQuery = "";
      this.currentPage = 1;
      this.tableData = this.allData;
      this.total = this.allData.length;
      this.updatePagedData();
    },

    // Handle pagination page change
    handleCurrentChange(page) {
      console.log("Changing page to:", page);
      this.currentPage = page;
      this.updatePagedData(page);
    },

    // Update paged data
    updatePagedData(currentPage = this.currentPage) {
      //console.log('Updating paged data for page:', currentPage);
      const start = (currentPage - 1) * this.pageSize;
      const end = currentPage * this.pageSize;
      this.pagedData = this.tableData.slice(start, end);
    },
  },

  created() {
    this.fetchPlayers();
  },
};
</script>

<style scoped>
.player-list {
  padding: 20px;
}

.header-row {
  margin-bottom: 20px;
}

.el-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-card {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

.avatar-uploader-icon {
  font-size: 30px;
  color: #4a90e2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover; /* 确保图片填充容器并保持比例 */
}
</style>
