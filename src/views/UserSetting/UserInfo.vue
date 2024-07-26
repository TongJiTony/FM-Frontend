<template>
  <div class="user-info-container">
    <el-card class="user-info-card">
      <h3>用户个人信息</h3>
      
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

      <!-- 编辑表单 -->
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
          <el-input v-model="Edituser.user_icon" placeholder="请输入头像URL"></el-input>
          <img :src="Edituser.user_icon" alt="User Icon" class="user-icon" @error="handleImageError"/>
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
      }
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
      this.$confirm('你确定要注销吗', '注销确认', {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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
            user_password: this.userInfo.user_psw,
          },
        }).then((response) => {
          console.log("logout's response:", response);
          if (response.status == 200) {
            this.$message.success("用户已经注销");
            this.$store.commit('user/resetUser'); // 重置vuex的全部信息
            this.$cookies.remove('isLoggedIn'); // 清除 Cookies
            this.$cookies.remove('token');
            this.$router.push({ name: 'Login' }); // 跳转到登录页面
          }
        }).catch((error) => {
          if (error.response) { // 服务器返回的响应错误
            if (error.response.data == 401) {
              this.$message.error("注销用户：密码输入不正确")
            }
            else if (error.response.data == 404) {
              this.$message.error("注销用户：该用户未找到");
            }
            else {
              this.$message.error(`Error: ${error.response.data}`);
            }
          }
          else {
            this.$message.error('Error: Network Error');
          }
        })
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
      })
    },
    changeAccount() {
      console.log("Change user Account successfully");
      this.$message.success("已经退出当前用户");
      this.$store.commit('user/resetUser'); // 重置Vuex中的用户信息
      this.$cookies.remove('isLoggedIn'); // 清除 Cookies
      this.$cookies.remove('token');
      this.$router.push({ name: 'Login' }); // 跳转到登录页面
    },
    async saveUserInfo() {
      try {
        const response = await axios.post('/api/v1/user/changeAttributes', {
          user_id: this.Edituser.user_id,
          new_name: this.Edituser.user_name,
          new_phone: this.Edituser.user_phone,
          new_icon: this.Edituser.user_icon,
        });
        console.log('respons of change:',response);
        if (response.data.code === 200) {
          // 更新 Vuex 中的用户信息
          this.$store.commit('user/setUser', this.Edituser);
          console.log('msg:',response.data.msg);
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
    }
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
