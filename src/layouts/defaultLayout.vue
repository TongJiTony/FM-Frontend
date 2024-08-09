<template>
  <el-container class="default-layout">
    <el-header>
      <div class="header-content">
        <img src="../assets/img/FM-Logo-2.png" class="logo" alt="Logo">
        <div class="site-title">FOOTBALLMANAGER</div> 
        <el-menu
          :default-active="$route.path"
          class="el-menu-custom"
          mode="horizontal"
          @select="handleSelect"
          background-color="#CDDC39"
          text-color="#fff"
          active-text-color="#fff"
          font-weight: bold
        >
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/test">Test</el-menu-item>
          <el-menu-item index="/team">Team</el-menu-item>
          <el-menu-item index="/player-list">Player List</el-menu-item>
          <el-menu-item index="/lineup">Lineup</el-menu-item>
          <div class="menu-right">
            <el-submenu>
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span class="username-title">{{this.$store.getters['user/getUserName']}}</span>
                <img :src="this.$store.getters['user/getUserIcon']" class="user-icon"/>
              </template>
              <el-menu-item class="user-action-item" index="/changepsw">Change Password</el-menu-item>
              <el-menu-item class="user-action-item" index="/userinfo">{{this.$store.getters['user/getUserName']}}'s info</el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-footer style="height:auto">
      <h4>关于我们</h4>
      <p>我们来自同济大学软件学院，这是我们的数据库课程设计项目，也是我们第一次接触软件项目开发，学习前后端开发的相关知识后的成果。</p>
      <p class="copyright">Copyright © 2024 TJ Football Manager. All rights reserved.</p>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  name: 'DefaultLayout',
  methods: {
    handleSelect(key) {
      if (this.$route.path !== key) {
        this.$router.push(key);
      }
    },
  },
  created() {
    console.log('Vuex 状态:', this.$store.state.user);
  },
}
</script>

<style>
.default-layout {
  min-height: 100vh;
}

.el-header {
  background:  #CDDC39;
  color: white;
  line-height: 60px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  height: 100%;
}

.logo {
  max-height: 100%; 
  width: auto;      
  object-fit: contain; 
  margin-right: 0px; 
  transition: transform 0.3s ease;
}

.site-title {
  font-family: 'Arial', sans-serif; 
  font-size: 24px; 
  font-weight: bold;
  color: #fff; 
  margin-left: 0px;
  margin-right: 180px; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 增加阴影效果 */
}


.el-menu-custom {
  display: flex;
  justify-content: center;
  background-color: #333;
}

.username-title {
  color: #212121;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 10px;
}

.user-action-item:hover {
  color: white;
  font-weight: bold;
}

.user-action-item {
  color: white;
}

.el-main {
  padding: 1rem;
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(162, 239, 172, 0.3)), url('~@/assets/img/main-bg2.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

.el-footer {
  background: #8BC34A;
  color: white;
  text-align: center;
  padding: 1rem;
}

.menu-right {
  margin-left: 300px;
  display: flex;
  align-items: center;
}
</style>
