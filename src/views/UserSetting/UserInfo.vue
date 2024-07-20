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
           <!-- 调试头像 URL -->
          <img :src="userInfo.user_icon" alt="User Icon" class="user-icon" @error="handleImageError"/>
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="confirmLogout">注销</el-button>
      <el-button type="primary" @click="confirmChangeAccount">切换用户</el-button>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import defaultAvatar from '@/assets/img/defaultIcon.jpg';// 引入备用头像图片


export default {
  computed: {
    ...mapGetters('user', ['getUserInfo']),
    userInfo() {
      // 打印 userInfo 以调试
      console.log('User Info:', this.getUserInfo);
      return this.getUserInfo;
    }
  },
  methods: {
    handleImageError(event) {
    console.error('头像加载失败，URL:', this.userInfo.user_icon);
    event.target.src = defaultAvatar; // 备用头像图片
    },

    confirmChangeAccount(){
        this.$confirm('你确定要切换账号吗？','切换账号确认',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
        }).then(() => {
            this.changeAccount();
        }).catch(()=>{
            this.$message.info("取消切换");
        })
    },
    confirmLogout() {
       // 打印头像 URL 以调试
      console.log('Avatar URL:', this.userInfo.user_icon);

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
    changeAccount(){

    },
    logout() {
      axios
        .delete('/api/v1/user/delete',{
            data:{
                user_id: this.userInfo.user_id,
                user_password: this.userInfo.user_psw,
            },
        }).then((response) => {
            console.log("delete's response data:",response.data);//打印返回的数据
            if(response.status===200){
                this.$message.success("该用户已经成功注销");
                this.$store.commit('user/resetUser');//重置Vuex中的用户信息
                this.$cookies.remove('isLoggedIn');// 清除 Cookies
                this.$cookies.remove('token');
                this.$router.push({ name: 'Login' });// 跳转到登录页面
            }
        }).catch((error) => {
            console.log("delete's response error data:",error.response.data);//打印返回的数据
            if(error.response){
                if(error.response.status === 401){
                    this.$message.error("注销用户：密码输入不正确")
                }
                else if(error.response.status === 404){
                    this.$message.error("注销用户：该用户未找到");
                }
                else {
                    this.$message.error(`Error: ${error.response.data}`);
                }
            }
            else{
                this.$message.error('Error: Network Error');
            }
        })
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