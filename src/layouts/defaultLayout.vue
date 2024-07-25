<template>
  <el-container class="default-layout">
    <el-header>
      <el-menu
        :default-active="$route.path"
        class="el-menu-custom"
        mode="horizontal"
        @select="handleSelect"
        background-color="#333"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/test">Test</el-menu-item>
        <el-menu-item index="/team">Team</el-menu-item>
        <el-menu-item index="/player-list">Player List</el-menu-item>
        <el-submenu>
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span class="username-title">{{this.$store.getters['user/getUserName']}}</span>
          </template>
          <el-menu-item class="user-action-item" index="/editinfo" >Edit Profile</el-menu-item>
          <el-menu-item class="user-action-item" index="/changepsw" >Change Password</el-menu-item>
          <el-menu-item class="user-action-item" index="/userinfo" > {{this.$store.getters['user/getUserName']}}'s info</el-menu-item>
        </el-submenu>
      </el-menu>
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
  background: #333;
  color: white;
  line-height: 60px;
}

.el-menu-custom {
  display: flex;
  justify-content: center;
  background-color: #333;
}

.username-title {
  color: #ffd04b;
}

.user-action-item:hover {
  color: white;
  font-weight: bold;
}
.user-action-item{
  color: white;
}

.el-main {
  padding: 1rem;
}

.el-footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
