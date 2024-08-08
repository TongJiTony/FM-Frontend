<template>
  <div class="medical-list">
    <el-row :gutter="20" class="header-row" justify="end">
      <el-col :span="18">
        <el-button
          @click="openAddMedicalDialog"
          type="primary"
          size="small"
          style="margin-bottom: 1rem"
          >添加医疗信息</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-input-group class="el-input-group">
          <el-select
            v-model="searchType"
            placeholder="选择搜索类型"
            size="small"
          >
            <el-option label="医疗编号" value="MEDICAL_ID"></el-option>
            <el-option label="球员编号" value="PLAYER_ID"></el-option>
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
      <el-col v-for="(medical, index) in pagedData" :key="index" :span="24">
        <el-card shadow="always" class="medical-card">
          <div class="medical-card-content">
            <div class="medical-item">
              <strong>球员姓名:</strong> {{ medical.PLAYER_NAME }}
            </div>
            <div class="medical-item">
              <strong>医疗编号:</strong> {{ medical.MEDICAL_ID }}
            </div>
            <div class="medical-item">
              <strong>球员编号:</strong> {{ medical.PLAYER_ID }}
            </div>
            <div class="medical-item">
              <strong>受伤部位:</strong> {{ medical.HURT_PART }}
            </div>
            <div class="medical-item">
              <strong>受伤时间:</strong> {{ medical.HURT_TIME }}
            </div>
            <div class="medical-item">
              <strong>医疗护理:</strong> {{ medical.MEDICAL_CARE }}
            </div>
            <div class="medical-actions">
              <el-button
                @click="confirmEdit(medical)"
                type="text"
                size="small"
                style="color: blue"
                >编辑</el-button
              >
              <el-button
                @click="confirmDelete(medical)"
                type="text"
                size="small"
                style="color: red"
                >删除</el-button
              >
            </div>
          </div>
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
      <p>确定要删除医疗信息 {{ selectedMedical?.MEDICAL_ID }} 吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </span>
    </el-dialog>

    <!-- Edit Medical Dialog -->
    <el-dialog
      title="修改医疗信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="医疗编号" :label-width="formLabelWidth">
          <el-input v-model="editForm.MEDICAL_ID" readonly></el-input>
        </el-form-item>
        <el-form-item label="受伤部位" :label-width="formLabelWidth">
          <el-input v-model="editForm.HURT_PART"></el-input>
        </el-form-item>
        <el-form-item label="受伤时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.HURT_TIME"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="医疗护理" :label-width="formLabelWidth">
          <el-input v-model="editForm.MEDICAL_CARE"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>

    <!-- Add Medical Dialog -->
    <el-dialog
      title="添加医疗信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="球员编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.PLAYER_ID"></el-input>
        </el-form-item>
        <el-form-item label="受伤部位" :label-width="formLabelWidth">
          <el-input v-model="addForm.HURT_PART"></el-input>
        </el-form-item>
        <el-form-item label="受伤时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.HURT_TIME"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="医疗护理" :label-width="formLabelWidth">
          <el-input v-model="addForm.MEDICAL_CARE"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddMedical">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      allData: [],
      pagedData: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 6,
      dialogVisible: false,
      editDialogVisible: false,
      addDialogVisible: false,
      searchType: "",
      searchQuery: "",
      selectedMedical: null,
      editForm: {
        medical_id: "", // Change to snake_case if your backend expects this
        player_id: "",
        hurt_part: "",
        hurt_time: "",
        medical_care: "",
      },
      addForm: {
        player_id: "",
        hurt_part: "",
        hurt_time: "",
        medical_care: "",
      },
      formRules: {
        player_id: [
          { required: true, message: "请输入球员编号", trigger: "blur" },
        ],
        hurt_part: [
          { required: true, message: "请输入受伤部位", trigger: "blur" },
        ],
        hurt_time: [
          {
            type: "date",
            required: true,
            message: "请选择受伤时间",
            trigger: "change",
          },
        ],
        medical_care: [
          { required: true, message: "请输入医疗护理", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    fetchMedicalRecords() {
      const teamId = this.$route.params.teamId;
      if (teamId) {
        console.log("Fetching data for team ID:", teamId);
        axios
          .get(`/api/v1/medical/displayall?teamid=${teamId}`)
          .then((response) => {
            console.log("Received data:", response.data);
            this.tableData = response.data.sort(
              (a, b) => a.MEDICAL_ID - b.MEDICAL_ID
            );
            this.allData = [...this.tableData];
            this.total = this.tableData.length;
            this.updatePagedData();
          })
          .catch((error) => {
            console.error("Failed to fetch medical list for team:", error);
          });
      } else {
        axios
          .get("/api/v1/medical/displayall")
          .then((response) => {
            this.tableData = response.data.sort(
              (a, b) => a.MEDICAL_ID - b.MEDICAL_ID
            );
            this.allData = [...this.tableData];
            this.total = this.tableData.length;
            this.updatePagedData();
          })
          .catch((error) => {
            console.error("Failed to fetch medical records:", error);
          });
      }
    },

    handleClick(medical) {
      console.log("Viewing medical record:", medical.MEDICAL_ID);
    },

    openAddMedicalDialog() {
      this.addDialogVisible = true;
    },

    handleDialogClose() {
      this.dialogVisible = false;
    },

    handleEditDialogClose() {
      this.editDialogVisible = false;
    },

    handleAddDialogClose() {
      this.addDialogVisible = false;
    },

    confirmDelete(medical) {
      this.selectedMedical = medical;
      this.dialogVisible = true;
    },

    handleDelete() {
      axios
        .delete(
          `/api/v1/medical/delete?medicalid=${this.selectedMedical.MEDICAL_ID}`
        ) //用delete方法！
        .then(() => {
          this.fetchMedicalRecords();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("Failed to delete medical records:", error);
        });
    },

    confirmEdit(medical) {
      this.editForm = { ...medical };
      this.editDialogVisible = true;
    },

    handleSave() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          const updatedMedicalData = {
            PLAYER_ID: this.editForm.PLAYER_ID, // Make sure PLAYER_ID is part of the edit form and correctly populated
            HURT_PART: this.editForm.HURT_PART,
            HURT_TIME: this.editForm.HURT_TIME,
            MEDICAL_CARE: this.editForm.MEDICAL_CARE,
          };

          axios
            .post(
              `/api/v1/medical/update?medicalid=${this.editForm.MEDICAL_ID}`,
              updatedMedicalData
            )
            .then(() => {
              this.fetchMedicalRecords();
              this.updatePagedData(this.currentPage);
              this.editDialogVisible = false;
            })
            .catch((error) => {
              if (error.response) {
                console.error(
                  "Failed to update medical record:",
                  error.response.data
                );
              } else if (error.request) {
                console.error("No response received:", error.request);
              } else {
                console.error("Error setting up request:", error.message);
              }
            });
        }
      });
    },

    handleAddMedical() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const newMedicalData = {
            PLAYER_ID: Number(this.addForm.PLAYER_ID),
            HURT_PART: this.addForm.HURT_PART,
            HURT_TIME: this.addForm.HURT_TIME,
            MEDICAL_CARE: this.addForm.MEDICAL_CARE,
            STATE: 0,
          };

          axios
            .post(`api/v1/medical/add`, newMedicalData)
            .then(() => {
              this.fetchMedicalRecords();
              this.addDialogVisible = false;
            })
            .catch((error) => {
              if (error.response) {
                console.error("Failed to add medical:", error.response.data);
              } else if (error.request) {
                console.error("No response received:", error.request);
              } else {
                console.error("Error setting up request:", error.message);
              }
            });
        }
      });
    },

    handleSearch() {
      console.log(
        "Performing search with type:",
        this.searchType,
        "and query:",
        this.searchQuery
      );
      const searchType = this.searchType;
      const searchQuery = this.searchQuery.toLowerCase();
      this.tableData = this.allData.filter((medical) =>
        medical[searchType].toString().toLowerCase().includes(searchQuery)
      );
      this.total = this.tableData.length;
      this.currentPage = 1;
      this.updatePagedData();
    },

    resetSearch() {
      this.searchType = "";
      this.searchQuery = "";
      this.currentPage = 1;
      this.tableData = this.allData;
      this.total = this.allData.length;
      this.updatePagedData();
    },

    handleCurrentChange(page) {
      this.currentPage = page;
      this.updatePagedData(page);
    },

    updatePagedData(currentPage = this.currentPage) {
      //console.log('Updating paged data for page:', currentPage);
      const start = (currentPage - 1) * this.pageSize;
      const end = currentPage * this.pageSize;
      this.pagedData = this.tableData.slice(start, end);
    },
  },
  created() {
    this.fetchMedicalRecords();
  },
};
</script>

<style scoped>
.medical-list {
  padding: 20px;
}

.header-row {
  margin-bottom: 20px;
}

.medical-card-content {
  display: flex; /* Use Flexbox to arrange elements in a row */
  align-items: center; /* Align items vertically in the center */
  justify-content: space-between; /* Distribute space evenly between items */
  padding: 10px; /* Add some padding for better spacing */
}

.medical-item {
  flex: 1; /* Allow items to grow and fill the available space */
  min-width: 100px; /* Ensure minimum width for each item */
  margin-right: 10px; /* Add some space between items */
}

.medical-actions {
  flex: 0 0 auto; /* Prevent actions from growing or shrinking */
}

.medical-card {
  margin-bottom: 20px; /* Space between cards */
}

.el-card {
  width: 100%; /* Make sure the card takes the full width */
}

.dialog-footer {
  text-align: right;
}

.el-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
