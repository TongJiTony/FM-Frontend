<template>
  <el-container class="default-layout">
    <el-header>
      <div class="header-content">
        <img src="../assets/img/FM-Logo-2.png" class="logo" alt="Logo" />
        <div class="site-title">FOOTBALLMANAGER</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-custom"
          mode="horizontal"
          @select="handleSelect"
          background-color="var(--primary-background)"
          text-color="var(--text-color)"
          active-text-color="var(--active-text-color)"
        >
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/test">Test</el-menu-item>
          <el-menu-item index="/team">Team</el-menu-item>
          <el-menu-item index="/player-list">Player List</el-menu-item>
          <el-menu-item index="/lineup">Lineup</el-menu-item>
          <el-menu-item index="/medical">Medical</el-menu-item>
          <div class="menu-right">
            <el-submenu>
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span class="username-title">{{
                  this.$store.getters["user/getUserName"]
                }}</span>
                <img
                  :src="this.$store.getters['user/getUserIcon']"
                  class="user-icon"
                />
              </template>
              <el-menu-item class="user-action-item" index="/changepsw"
                >Change Password</el-menu-item
              >
              <el-menu-item class="user-action-item" index="/userinfo"
                >{{ this.$store.getters["user/getUserName"] }}'s
                info</el-menu-item
              >
            </el-submenu>
          </div>
        </el-menu>
        <el-button class="el--button-change-theme" @click="toggleTheme"
          >切换主题</el-button
        >
        <el-button
          class="el--button-change-BackGroundImages"
          @click="toggleBackgroundImage"
          >切换背景</el-button
        >
      </div>
    </el-header>
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-footer style="height: auto">
      <h4>关于我们</h4>
      <p>
        我们来自同济大学软件学院，这是我们的数据库课程设计项目，也是我们第一次接触软件项目开发，学习前后端开发的相关知识后的成果。
      </p>
      <p class="copyright">
        Copyright © 2024 TJ Football Manager. All rights reserved.
      </p>
    </el-footer>
  </el-container>
</template>

<script>
import { themes } from "@/assets/color/color.js"; // 引入主题配色

export default {
  data() {
    return {
      themes,
      currentThemeName: "green", // 初始主题
      currentThemeIndex: 0,
      backgroundViews: {
        greenGradient: "linear-gradient(to right, #43cea2, #185a9d)",
        purpleGradient: "linear-gradient(to right, #8e2de2, #4a00e0)",
        orangeGradient: "linear-gradient(to right, #ff7e5f, #feb47b)",
        image1: `url(${require("@/assets/img/main-bg-1.png")})`,
        image2: `url(${require("@/assets/img/main-bg-2.png")})`,
      },
      currentBackgroundName: "image1", // 初始背景
      currentBackgroundIndex: 0,
    };
  },
  computed: {
    currentTheme() {
      return this.themes[this.currentThemeName];
    },
    currentBackground() {
      return this.backgroundViews[this.currentBackgroundName];
    },
  },
  methods: {
    applyTheme(theme) {
      for (let key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
      }
    },
    applyBackView(background) {
      document.documentElement.style.setProperty(
        "--background-views",
        background
      );
    },
    toggleTheme() {
      const themeNames = Object.keys(this.themes);
      console.log("themeNames:", themeNames);
      this.currentThemeIndex = (this.currentThemeIndex + 1) % themeNames.length;
      this.currentThemeName = themeNames[this.currentThemeIndex];
      this.$message.info(`主题切换至 ${this.currentThemeName}`);
      this.applyTheme(this.currentTheme);
    },
    toggleBackgroundImage() {
      const backgroundNames = Object.keys(this.backgroundViews);
      this.currentBackgroundIndex =
        (this.currentBackgroundIndex + 1) % backgroundNames.length;
      this.currentBackgroundName = backgroundNames[this.currentBackgroundIndex];
      this.$message.info(`背景切换至 ${this.currentBackgroundName}`);
      this.applyBackView(this.currentBackground);
    },
    handleSelect(key) {
      if (this.$route.path !== key) {
        this.$router.push(key);
      }
    },
  },
  created() {
    this.applyTheme(this.currentTheme);
    this.applyBackView(this.currentBackground);
    console.log("Vuex 状态:", this.$store.state.user);
  },
};
</script>

<style>
.default-layout {
  min-height: 100vh;
}

.el-header {
  background: var(--primary-background);
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
  font-family: "Arial", sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
  margin-left: 0px;
  margin-right: 180px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 增加阴影效果 */
}

.el-menu-custom {
  display: flex;
  justify-content: center;
}

.username-title {
  color: var(--username-title-color);
  font-weight: bold;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 10px;
}

.user-action-item:hover {
  color: var(--text-color);
  font-weight: bold;
}

.user-action-item {
  color: var(--text-color);
}

.el-main {
  padding: 1rem;
  background: var(--main-bg-gradient),
    var(--background-views) no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

.el-footer {
  background: var(--footer-background);
  color: var(--text-color);
  text-align: center;
  padding: 1rem;
}

.menu-right {
  margin-left: 100px;
  display: flex;
  align-items: center;
}

.el--button-change-theme {
  margin-left: 0px;
  margin-right: 0px;
}
</style>
