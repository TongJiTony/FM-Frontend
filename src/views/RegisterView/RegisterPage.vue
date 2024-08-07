<template>
  <el-container>
    <el-header class="header">创建你的 FootballManager 账户</el-header>
    <el-main>
      <el-form
        :model="registerForm"
        :rules="registerRule"
        ref="registerForm"
        @keyup.enter.native="registerFormSubmit()"
        status-icon="true"
        label-width="120px"
        class="register-form"
      >
        <el-form-item label="用户姓名：" prop="userName">
          <el-input
            v-model="registerForm.userName"
            placeholder="请输入用户姓名"
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户权限：" prop="userRight">
          <el-select
            v-model="registerForm.userRight"
            placeholder="请选择用户权限"
            class="select-field"
          >
            <el-option
              v-for="item in userRights"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码：" prop="userPassword">
          <el-input
            type="password"
            v-model="registerForm.userPassword"
            placeholder="请输入密码"
            show-password
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="userPhone">
          <el-input
            v-model="registerForm.userPhone"
            placeholder="请输入手机号码"
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像图像：" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :http-request="customUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="registerForm.icon"
              :src="registerForm.icon"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon">上传头像</i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="registerFormSubmit()"
            class="register-button"
          >注册</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
      registerForm: {
        userName: "",
        userRight: "",
        userPassword: "",
        userPhone: "",
        icon: "",
      },
      registerRule: {
        userName: [
          { required: true, message: "用户姓名不可以为空", trigger: "blur" },
        ],
        userRight: [
          { required: true, message: "用户权限不可以为空", trigger: "blur" },
        ],
        userPassword: [
          { required: true, message: "密码不可以为空", trigger: "blur" },
        ],
        userPhone: [
          { required: true, message: "电话号码不可以为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "头像信息不可以为空", trigger: "blur" },
        ],
      },
      userRights: [
        { value: "player", label: "球员" },
        { value: "coach", label: "教练" },
        { value: "manager", label: "经理" },
      ],
      uploadAction:
        "https://api.imgbb.com/1/upload",
      currentDeleteUrl:"",
      imgbbApiKey: "a18b4cdd1ea4b32881a598e7f32b854a",
      name:"FoodballManager",
      expirationTime: 604800, // 7 days in seconds
    };
  },
  methods: {
    customUpload(request) {
      const formData = new FormData();
      formData.append("image", request.file);

      axios
        .post(`${this.uploadAction}?key=${this.imgbbApiKey}&name=${this.name}&expiration=${this.expirationTime}`, formData)
        .then((response) => {
          request.onSuccess(response.data);
        })
        .catch((error) => {
          request.onError(error);
        });
    },
    deleteCurrentImageUrl(){
      if(this.currentDeleteUrl){
        console.log("currentDeleteUrl need to be delete",this.currentDeleteUrl);
        axios
          .delete('/api/v1/user/deleteImage',{
            params: { delete_url: this.currentDeleteUrl }
        }).then((response) => {
          console.log("response of delete:",response);
           if (response.data.code === 200) {
            console.log('Image deleted successfully from the image hosting service.');
            this.$message.success("Image deleted successfully from the image hosting service.")
          } 
          else {
            console.error('Failed to delete image.');
            this.$message.error('Failed to delete image.');
          }
        });
        console.log("Deleted previous image");
        this.currentDeleteUrl = ""; // 删除成功后清空 URL
      }
      else{
        console.log("currentDeleteUrl don not need to be delete");
        this.$message.error("删除旧头像失败");
      }
    },
    handleAvatarSuccess(response) {
      console.log("response:",response);
      if (response && response.data && response.data.url) {
        this.deleteCurrentImageUrl();
        this.registerForm.icon = response.data.url;
        this.currentDeleteUrl = response.data.delete_url;
        this.$message.info("头像加载成功！");
      } else {
        this.$message.error("头像上传失败，请重试！");
      }
    },
    handleAvatarError(error) {
      console.error("头像上传失败", error);
      this.$message.error("头像上传失败，请重试！");
    },
    beforeAvatarUpload(file) {
      const isPNGorJPG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPNGorJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isPNGorJPG && isLt2M;
    },
    registerFormSubmit() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          axios
            .post("/api/v1/user/add", {
              userName: this.registerForm.userName,
              userRight: this.registerForm.userRight,
              userPassword: this.registerForm.userPassword,
              userPhone: this.registerForm.userPhone,
              icon: this.registerForm.icon,
            })
            .then(({ data }) => {
              if (data.code == 200) {
                this.showSuccessMessage(
                  data.user_id,
                  data.user_name,
                  data.user_right,
                  data.user_password,
                  data.user_phone,
                  data.icon
                );
                //然后上传用户头像信息
                axios
                  .post("/api/v1/user/saveImage",{
                    icon: this.registerForm.icon,
                    delete_icon: this.currentDeleteUrl,
                    user_id: data.user_id,
                  })
                  .then(({Imagedata}) => {
                    console.log("saveImage:",Imagedata);
                    this.$message.success("图片上传成功");
                  })
                  .catch((Imageerror) => {
                    console.log("Imageerror:",Imageerror);
                    this.$message.error("图片保存失败，请重试");
                  });
              } else if (data.code == 500) {
                console.log("注册失败");
              }
            })
            .catch((error) => {
              console.log("注册失败", error);
              this.$message.error("注册错误，请重试");
            });
        }
      });
    },
    showSuccessMessage(
      user_id,
      user_name,
      user_right,
      user_password,
      user_phone,
      icon
    ) {
      MessageBox.alert(
        `注册成功！\n
                      用户ID: ${user_id}\n
                      用户姓名: ${user_name}\n
                      用户权限: ${user_right}\n
                      用户密码: ${user_password}\n
                      手机号码: ${user_phone}\n
                      头像: ${icon}`,
        "注册成功",
        {
          confirmButtonText: "确定",
          callback: () => {
            this.$router.replace({ name: "Login" });
          },
        }
      );
    },
  },
};
</script>

<style scoped>
.el-container {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.el-header {
  background-color: #4a90e2;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-main {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-field,
.select-field {
  border-radius: 5px;
}

.avatar-uploader .el-upload {
  border: 2px dashed #4a90e2;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 10px;
  transition: border-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px; /* 设置固定宽度 */
  height: 100px; /* 设置固定高度 */
}

.avatar-uploader:hover .el-upload {
  border-color: #007aff;
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