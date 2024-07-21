<template>
  <div class="logout-container">
    <el-card class="user-info-card">
      <h3>用户信息</h3>
      <el-form>
        <el-form-item label="用户ID">
          <span>{{ userInfo.user_id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ userInfo.user_name }}</span>
        </el-form-item>
        <el-form-item label="权限">
          <span>{{ userInfo.user_right }}</span>
        </el-form-item>
        <el-form-item label="电话">
          <span>{{ userInfo.user_phone }}</span>
        </el-form-item>
        <el-form-item label="头像">
          <img :src="userInfo.user_icon" alt="User Icon" class="user-icon"/>
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="confirmLogout">注销</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['getUserInfo']),
    userInfo() {
      return this.getUserInfo;
    }
  },
  methods: {
    confirmLogout() {
      this.$confirm('你确定要注销吗？', '注销确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout();
      }).catch(() => {
        this.$message.info('取消注销');
      });
    },
    logout() {
      // 清除 Vuex 中的用户信息
      this.$store.commit('user/resetUser');

      // 清除 Cookies
      this.$cookies.remove('isLoggedIn');
      this.$cookies.remove('token');

      // 跳转到登录页面
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
.logout-container {
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