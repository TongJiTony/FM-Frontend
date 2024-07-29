<template>
  <!--div class="register-container"-->
  <el-container>
    <el-header> 创建你的FoodballManager账户 </el-header>
    <el-main>
      <el-form
        :model="registerForm"
        :rules="registerRule"
        ref="registerForm"
        @keyup.enter.native="registerFormSubmit()"
        status-icon="true"
      >
        <el-form-item label="用户姓名：" prop="userName">
          <el-input v-model="registerForm.userName" placeholder="用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="用户权限：" prop="userRight">
          <el-select
            v-model="registerForm.userRight"
            placeholder="请选择用户权限"
          >
            <el-option
              v-for="item in userRights"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码：" prop="userPassword">
          <el-input v-model="registerForm.userPassword" placeholder="密码">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="userPhone">
          <el-input v-model="registerForm.userPhone" placeholder="手机号码">
          </el-input>
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
          <el-button type="primary" @click="registerFormSubmit()"
            >注册</el-button
          >
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
        "https://api.imgbb.com/1/upload?key=a18b4cdd1ea4b32881a598e7f32b854a",
    };
  },
  methods: {
    customUpload(request) {
      const formData = new FormData();
      formData.append("image", request.file);

      axios
        .post(this.uploadAction, formData)
        .then((response) => {
          request.onSuccess(response.data);
        })
        .catch((error) => {
          request.onError(error);
        });
    },
    handleAvatarSuccess(response) {
      console.log("response of Imgbb:", response);
      if (response && response.data && response.data.url) {
        this.registerForm.icon = response.data.url;
      } else {
        this.$message.error("头像上传失败，请重试！");
      }
    },
    handleAvatarError(err) {
      console.error("头像上传失败", err);
      this.$message.error("头像上传失败，请重试！");
    },
    beforeAvatarUpload(file) {
      console.log("file's data:", file);
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
            this.$router.replace({ name: "Login" }); // 跳转到登录界面
          },
        }
      );
    },
  },
};
</script>

<style scoped>
.el-container {
  background-color: #242325;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.el-header {
  background-color: #20062f;
  color: #d7d2dc;
  display: flex;
  border-radius: 30px;
  box-shadow: 0 2px;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.el-main {
  max-width: 400px;
  margin-right: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
