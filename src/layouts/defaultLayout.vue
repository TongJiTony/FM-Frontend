<template>
  <el-container class="default-layout">
    <el-header>
      <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/test">Test</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer>
      <p>Footer content here</p>
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
}

.el-menu-demo {
  background-color: #333;
}

.el-menu-demo .el-menu-item {
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