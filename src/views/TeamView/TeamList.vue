<template>
    <div>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <el-card>
          <el-row>
            <el-col :span="18">
              <el-button type="primary"  @click="formTeam" size="small">组建球队</el-button>      
            </el-col>
            <el-col :span="6">
              <el-input v-model="search" placeholder="输入球队名称搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
          </el-row>
      
      <el-col :span="24" style="height: 12px;"></el-col> 
          <el-row>
            <el-table :data="team.filter(data => !search || data.TEAM_NAME.includes(search))" style="width: 100%">
              <el-table-column prop="TEAM_ID" label="ID" width="200">
              </el-table-column>
              <el-table-column prop="TEAM_NAME" label="球队名称" width="200">
              </el-table-column>
              <el-table-column prop="ESTABLISHED_DATE" label="成立时间" width="250">
              </el-table-column>
              <el-table-column prop="HEAD_COACH" label="主教练" width="200">
              </el-table-column>
              <el-table-column prop="CITY" label="城市"  >
              </el-table-column>
             
              <el-table-column fixed="right" width="250">
                <!-- eslint-disable-next-line -->
            
                <template slot-scope="scope">
                  <el-button @click="handleDetails(scope.row)" type="text" size="small" >详情</el-button>
                  <el-button    @click="confirmEdit(scope.row)" type="text" size="small"  style="color: blue" >编辑</el-button>
                  <el-button @click="handleDelete(scope.row)" type="text" size="small"  style="color: red">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>                
        </el-card>

        <el-dialog
      title="修改球队信息"
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
        <el-form-item label="球队名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="主教练" :label-width="formLabelWidth">
          <el-input v-model="editForm.HEAD_COACH"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.ESTABLISHED_DATE"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="editForm.CITY"></el-input>
        </el-form-item>
        <el-form-item label="球队队徽：" :label-width="formLabelWidth">
          <el-input v-model="editForm.TEAM_ICON"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>

        <el-dialog
      title="添加球队信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef">
        <el-form-item label="球队名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.TEAM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="主教练" :label-width="formLabelWidth">
          <el-input v-model="addForm.HEAD_COACH"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.ESTABLISHED_DATE"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="addForm.CITY"></el-input>
        </el-form-item>
        <el-form-item label="球队队徽：" prop="TEAM_ICON">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :action="uploadAction"
            :http-request="customUpload"
            :show-file-list="true"
          >
            <img v-if="addForm.TEAM_ICON" :src="addForm.TEAM_ICON" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon">上传球队队徽</i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddTeam">添加</el-button>
      </span>
    </el-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        search: '',
        loading: true,
        team: [],
        addDialogVisible: false,
        editDialogVisible: false,
        editForm:{
        TEAM_ID:'',
        TEAM_NAME: "",
        ESTABLISHED_DATE: "",
        HEAD_COACH: "",
        CITY: "",
        TEAM_ICON: "",
        },
        addForm: {
        TEAM_NAME: "",
        ESTABLISHED_DATE: "",
        HEAD_COACH: "",
        CITY: "",
        TEAM_ICON: "",
      },

      uploadAction: "https://api.imgbb.com/1/upload",
      imgbbApiKey: "a18b4cdd1ea4b32881a598e7f32b854a",
     
      expirationTime: 604800, // 7 days in seconds
      };
    },
    created() {
      this.refresh();
    },
    
    methods:{
      confirmEdit(team) {
    
      this.editForm = { ...team };
      this.editDialogVisible = true;
    },
      handleAddTeam() {
      console.log("Form data before validation:", this.addForm);
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          // Construct the JSON object as per server's expectations
          // Convert to number
          const newTeamData = {
            TEAM_NAME: this.addForm.TEAM_NAME,
            ESTABLISHED_DATE: this.addForm.ESTABLISHED_DATE,
            HEAD_COACH: this.addForm.HEAD_COACH,
            CITY: this.addForm.CITY,
            TEAM_ICON: this.addForm.TEAM_ICON,
          };
          console.log("New team data:", newTeamData);

          // Use the correct API endpoint
          axios
            .post(`api/v1/team/add`, newTeamData)
            .then(() => {
              this.refresh(); // 刷新玩家列表
              this.addDialogVisible = false; // 关闭对话框
            })
            .catch((error) => {
              if (error.response) {
                // 服务器返回的错误响应
                console.error("Failed to add team:", error.response.data);
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
      refresh(){
        axios.get('/api/v1/team/displayall')
          .then(response => {
            this.team = response.data;
            this.loading = false;
          })
          .catch(error => {
            console.error(error);
            this.loading = false;
          });
      },
      handleDetails(row){
        console.log(row.TEAM_ID);
        this.$router.push(`/teamdetail/${row.TEAM_ID}`); 

      },
      handleDelete(row) {
        console.log(row.TEAM_ID);
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(`/api/v1/team/delete?Teamid=${row.TEAM_ID}`)
          .then(response=>{
            if (response.status ==200){
              this.sendMessage('success','删除成功!');
              this.refresh();
            }
          })
        }).catch(() => {
          this.sendMessage('info','已取消删除')          
        });  
      },
      sendMessage(Type, Message) {
        this.$message({
          type: Type,
          message: Message,
        });
      },
      formTeam(){
        this.addDialogVisible=true;
      },
      handleAddDialogClose() {
      this.addDialogVisible = false;
    },

    handleEditDialogClose() {
      console.log("Closing edit dialog");
      this.editDialogVisible = false;
    },
    handleSave() {

      // 构建符合服务器要求的完整 JSON 对象
      const updatedTeamData = {
        TEAM_NAME: this.editForm.TEAM_NAME,
        ESTABLISHED_DATE: this.editForm.ESTABLISHED_DATE,
        HEAD_COACH: this.editForm.HEAD_COACH,
        CITY: this.editForm.CITY,
        TEAM_ICON: this.editForm.TEAM_ICON,
      };

      // 使用正确的 API 路径
      axios
        .post(
          `/api/v1/team/update?updateTeamid=${this.editForm.TEAM_ID}`,
          updatedTeamData
        )
        .then(() => {
        
          this.refresh();
          this.editDialogVisible = false;
        })
        .catch((error) => {
          console.error("Failed to update team:", error);
        });
    },
    },
  };
  </script>

<style scoped>
.avatar-uploader-icon {
  font-size: 15px;
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
.dialog-footer {
  text-align: right;
}
</style>
