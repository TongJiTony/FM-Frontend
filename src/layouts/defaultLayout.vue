<template>
  <el-container class="default-layout">
    <el-header>
      <el-menu
        :default-active="$route.path"
        class="el-menu-custom"
        mode="horizontal"
        @select="handleSelect"
        background-color= "#333"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/test">Test</el-menu-item>
        <el-menu-item index="/player-list">Player List</el-menu-item>
        <el-menu-item index="/setting" class="right-menu-item"><i class="el-icon-setting"></i>UserName</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- <el-aside width="200px" style="background-color: rgb(238, 241, 246)"> -->
        <!-- <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside> -->
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
      if (this.$route.path !== key){
        this.$router.push(key);
      }
    }
  }
};
</script>

<style>
/* 这里可以添加默认布局的样式 */
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

.right-menu-item {
    margin-left: auto;
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
