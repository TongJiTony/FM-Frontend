<template>
  <div class="medical-list">


    <el-card shadow="never">
      <el-row :gutter="20" class="header-row" justify="end">
      
          <el-col :span="12">
        <el-button
          @click="openAddMedicalDialog"
          type="primary"
          size="small"
          style="margin-bottom: 1rem"
          >添加医疗信息</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-statistic
            :value="hurtCount"
            :title="title1"
          ></el-statistic>
        
      </el-col>
      <el-col :span="3">
        <el-statistic
            :value="retiredCount"
            :title="title2"
          ></el-statistic>
      </el-col>
      <el-col :span="6">
        <el-input-group class="el-input-group">
          <el-select
            v-model="searchType"
            placeholder="选择搜索类型"
            size="small"
          >
            <el-option label="医疗编号" value="MEDICAL_ID"></el-option>
            <el-option label="球员姓名" value="PLAYER_NAME"></el-option>
          </el-select>
          <el-input
            v-model="searchQuery"
            placeholder="输入搜索内容"
            size="small"
          ></el-input>
          <el-button @click="handleSearch" type="primary" size="small">搜索</el-button>
          <el-button @click="resetSearch" type="text" size="small">重置</el-button>
        </el-input-group>
      </el-col>      
    </el-row>
    <el-row :gutter="20">
      <el-card shadow="never">
        <el-table :data="pagedData" style="width: 100%">
        <el-table-column prop="MEDICAL_ID" label="医疗编号" >
        </el-table-column>
        <el-table-column prop="PLAYER_NAME" label="球员姓名" >
        </el-table-column>
        <el-table-column prop="HURT_PART" label="受伤部位">
        </el-table-column>
        <el-table-column prop="MEDICAL_CARE" label="医疗护理" >
        </el-table-column>
        <el-table-column prop="HURT_TIME" label="受伤时间" :formatter="formatData">
        </el-table-column>     
        <el-table-column prop="PRED_REC_DATE" label="预计康复时间" :formatter="formatData">
        </el-table-column>
        <el-table-column  label="是否痊愈">
          <template slot-scope="scope">
          <el-tag :type="scope.row.STATE === 1 ? 'success' : 'danger'">
            {{ scope.row.STATE === 1 ? '已痊愈' : '未痊愈' }}
          </el-tag>
        </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" >
                <!-- eslint-disable-next-line -->
            
                <template slot-scope="scope">
                  <el-button
                @click="confirmEdit(scope.row)"
                type="text"
                size="small"
                style="color: blue"
                >编辑</el-button
              >
              <el-button
                @click="confirmDelete(scope.row)"
                type="text"
                size="small"
                style="color: red"
                >删除</el-button
              >
                </template>
              </el-table-column>
            </el-table>
      </el-card>
      <el-pagination
      background
      layout="total,prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    </el-row>
  </el-card>
  
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
        <el-form-item label="预计康复时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.PRED_REC_DATE"
            type="date"
            placeholder="选择预计康复时间"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth">
          <el-select v-model="editForm.STATE" placeholder="选择健康状态">
            <el-option label="健康" :value="0"></el-option>
            <el-option label="受伤" :value="1"></el-option>
          </el-select>
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
        <el-form-item
          label="预计康复时间"
          :label-width="formLabelWidth"
          prop="PRE_REC_DATE"
        >
          <el-date-picker
            v-model="addForm.PRED_REC_DATE"
            type="date"
            placeholder="选择预计康复时间"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="健康状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.STATE" placeholder="选择健康状态">
            <el-option label="健康" :value="0"></el-option>
            <el-option label="受伤" :value="1"></el-option>
          </el-select>
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
      title1: "本月受伤人数",
      title2:'已痊愈',
      hurtCount:0,
      retiredCount:0,
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
        medical_id: "",
        player_id: "",
        hurt_part: "",
        hurt_time: "",
        medical_care: "",
        pred_rec_date: "",
        state: "",
      },
      addForm: {
        player_id: "",
        hurt_part: "",
        hurt_time: "",
        medical_care: "",
        pred_rec_date: "",
        state: "",
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
        pred_rec_date: [
          {
            required: true,
            message: "请选择预计康复日期",
            trigger: "change",
          },
        ],
        state: [
          { required: true, message: "请选择健康状态", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    countHurtTime(tableData) {
 
      const targetDate = '2024-08';

      for (const data of tableData) {
        const hurtTime = data.HURT_TIME;
        const date = hurtTime.substring(0, 7); // 提取日期部分
        if (date == targetDate) {
         this.hurtCount++;
         if(data.STATE==1)
          this.retiredCount++;
        }
     }
    },
    formatData(row, column, cellValue){
      const date = new Date(cellValue);
      return date.toLocaleDateString();
    },
    formatHealth(row, column, cellValue){
      return cellValue === 0 ? "已痊愈" : "未痊愈";
    },
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
            console.log('医疗信息：',this.tableData )
            this.countHurtTime(this.tableData );
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
            console.log('医疗信息：',this.tableData )
            this.countHurtTime(this.tableData );
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
            PLAYER_ID: this.editForm.PLAYER_ID,
            HURT_PART: this.editForm.HURT_PART,
            HURT_TIME: this.editForm.HURT_TIME,
            MEDICAL_CARE: this.editForm.MEDICAL_CARE,
            PRED_REC_DATE: this.editForm.PRED_REC_DATE,
            STATE: this.editForm.STATE,
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
            HURT_TIME: this.formatDateTime(this.addForm.HURT_TIME),
            MEDICAL_CARE: this.addForm.MEDICAL_CARE,
            STATE: Number(this.addForm.STATE),
            PRED_REC_DATE: this.formatDate(this.addForm.PRED_REC_DATE),
          };

          console.log(
            "Sending JSON data to backend:",
            JSON.stringify(newMedicalData)
          );

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

    formatDateTime(dateTime) {
      if (!dateTime) return null;
      return dateTime instanceof Date
        ? dateTime.toISOString().split(".")[0] // 去除毫秒部分
        : dateTime;
    },

    // 格式化日期为 "yyyy-MM-dd"
    formatDate(date) {
      if (!date) return null;
      return date instanceof Date
        ? date.toISOString().split("T")[0] // 仅保留日期部分
        : date;
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
