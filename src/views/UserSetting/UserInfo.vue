<template>
  <div class="user-info-container">
    <el-card class="user-info-card">
      <h3>用户个人信息</h3>
      
      <!-- 显示用户信息 -->
      <el-form v-if="!isEditing">
        <el-form-item label="用户ID">
          <span>{{ userInfo.user_id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ userInfo.user_name }}</span>
        </el-form-item>
        <el-form-item label="权限">
          <el-tag>{{ userInfo.user_right }}</el-tag>
        </el-form-item>
        <el-form-item label="电话">
          <span>{{ userInfo.user_phone }}</span>
        </el-form-item>
        <el-form-item label="头像">
          <img :src="userInfo.user_icon" :alt="`${userInfo.user_name}-Icon`" class="user-icon" @error="handleImageError"/>
        </el-form-item>
      </el-form>

      <!-- 编辑用户信息表单 -->
      <el-form v-if="isEditing" :model="Edituser" ref="userForm">
        <el-form-item label="用户ID">
          <span>{{ Edituser.user_id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="Edituser.user_name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-tag>{{ Edituser.user_right }}</el-tag>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="Edituser.user_phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :http-request="customUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="Edituser.user_icon" :src="Edituser.user_icon" class="user-icon" @error="handleImageError"/>
            <i v-else class="el-icon-plus avatar-uploader-icon">上传头像</i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button v-if="!isEditing" type="primary" @click="startEditing">修改信息</el-button>
      <el-button type="danger" v-if="!isEditing" @click="confirmLogout">注销用户</el-button>
      <el-button type="warning" v-if="!isEditing" @click="confirmChangeAccount">退出登录</el-button>
      <el-button v-if="isEditing" type="success" @click="saveUserInfo">保存修改</el-button>
      <el-button v-if="isEditing" @click="cancelEditing">取消修改</el-button>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import defaultAvatar from '@/assets/img/defaultIcon.jpg';

export default {
  data() {
    return {
      isEditing: false,
      Edituser: {
        user_id: '',
        user_name: '',
        user_right: '',
        user_phone: '',
        user_icon: ''
      },
      Input_user_psw:'',
      uploadAction: "https://api.imgbb.com/1/upload",
      imgbbApiKey: "a18b4cdd1ea4b32881a598e7f32b854a",
      expirationTime: 2592000, // 30 days in seconds
      name:"FoodballManager",
      currentDeleteUrl:"",
    };
  },
  computed: {
    ...mapGetters('user', ['getUserInfo']),
    userInfo() {
      return this.getUserInfo;
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = defaultAvatar;
    },
    startEditing() {
      this.Edituser = { ...this.userInfo };
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
    },
    confirmLogout() {
      this.$prompt('请输入密码以确认注销','用户注销',{
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputType:'password',
        inputPattern: /.+/, 
        inputErrorMessage: '密码不能为空'
      })
      .then(({value}) => {
        this.Input_user_psw = value;
        this.logout();
      }).catch(() => {
        this.$message.info("取消注销");
      });
    },
    logout() {
      axios
        .delete('/api/v1/user/delete', {
          data: {
            user_id: this.userInfo.user_id,
            user_password: this.Input_user_psw,
          },
        }).then((response) => {
          if (response.status === 200) {
            this.currentDeleteUrl = this.$store.getters["user/getDeleteIcon"];
            let delete_url = this.currentDeleteUrl.user_delete_icon;
            axios.delete('/api/v1/user/deleteImage',{
              params: { delete_url: delete_url }
            })
            .then(response => {
              if (response.data.code === 200) {
                this.$message.success("图像已成功删除");
              } 
              else {
                this.$message.error(`删除图像失败: ${response.data.msg}`);
              }
            })
            .catch(error => {
              console.error("error:",error);
              this.$message.error('删除图像失败，请重试');
              });
            
            this.$message.success("用户已经注销");
            this.$store.commit('user/resetUser');
            this.$cookies.remove('isLoggedIn');
            this.$cookies.remove('token');
            this.$router.replace({ name: 'Login' });
          }
        }).catch((error) => {
          if (error.response) {
            if (error.response.data === 401) {
              this.$message.error("注销用户：密码输入不正确")
            } 
            else if (error.response.data === 404) {
              this.$message.error("注销用户：该用户未找到");
            } 
            else {
              this.$message.error(`Error: ${error.response.data}`);
            }
          } else {
            this.$message.error('Error: Network Error');
          }
        });
    },
    confirmChangeAccount() {
      this.$confirm('你确定要退出登录吗？', '退出登录确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        this.changeAccount();
      }).catch(() => {
        this.$message.info("取消退出操作");
      });
    },
    changeAccount() {
      this.$message.success("已经退出当前用户");
      this.$store.commit('user/resetUser');
      this.$cookies.remove('isLoggedIn');
      this.$cookies.remove('token');
      this.$router.push({ name: 'Login' });
    },
    async saveUserInfo() {
      try {
      // 如果有头像更新，发送头像信息到服务器
        if (this.Edituser.user_icon !== this.userInfo.user_icon) {
          await axios.post('/api/v1/user/saveImage', {
          icon: this.Edituser.user_icon,
          delete_icon: this.userInfo.user_icon,
          user_id: this.Edituser.user_id,
          });
        }
    
        const response = await axios.post('/api/v1/user/changeAttributes', {
          user_id: this.Edituser.user_id,
          new_name: this.Edituser.user_name,
          new_phone: this.Edituser.user_phone,
          new_icon: this.Edituser.user_icon,
          });
    
        if (response.data.code === 200) {
          this.$store.commit('user/setUser', this.Edituser);
          this.$message.success('修改成功');
          this.isEditing = false;
        } 
        else {
          this.$message.error(response.data.msg);
        }
      } 
      catch (error) {
        this.$message.error('修改失败，请稍后再试');
           }
    },
    beforeAvatarUpload(file) {
      const isPNGorJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPNGorJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNGorJPG && isLt2M;
    },
    customUpload(request) {
      const formData = new FormData();
      formData.append('image', request.file);
      axios.post(`${this.uploadAction}?key=${this.imgbbApiKey}&name=${this.name}&expiration=${this.expirationTime}`, formData)
        .then(response => {
          request.onSuccess(response.data);
        })
        .catch(error => {
          request.onError(error);
        });
    },
    handleAvatarSuccess(response) {
      if (response && response.data && response.data.url) {
        this.Edituser.user_icon = response.data.url;
        this.currentDeleteUrl = response.data.delete_url;
        this.$message.info('头像加载成功！');
        console.log("response:",response);
      } else {
        this.$message.error('头像上传失败，请重试！');
      }
    },
    handleAvatarError(error) {
      this.$message.error('头像上传失败，请重试！');
      console.log(error);
    },
  }
}
</script>

<style scoped>
.user-info-container {
  padding: 20px;
}
.user-info-card {
  max-width: 400px;
  margin: auto;
}
.user-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
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
  width: 100px;
  height: 100px;
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
</style>
