<!--defaultLayout.vue 文件定义了应用的默认布局，包括头部菜单、主内容区域和页脚。它使用了Element UI组件来实现布局和样式。-->

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
<!--
<el-container>: Element UI 的容器组件，作为布局的根元素。
<el-header>: 定义头部区域，包含一个水平的菜单。
<el-menu>: Element UI 的菜单组件，default-active 属性绑定到当前路由路径，@select 事件绑定到handleSelect方法。
<el-menu-item>: 菜单项，index属性指定了路由路径。
<el-main>: 定义主内容区域，包含<router-view> 用于渲染当前路由匹配的组件。
<el-footer>: 定义页脚区域。
-->


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
<!--
组件名称: name 定义组件名称为 DefaultLayout。
方法: handleSelect 方法用于处理菜单项选择事件。如果当前路径和选中的菜单项路径不同，则导航到选中的路径。
-->



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
<!--
全局样式: 设置默认布局的最小高度为100vh，确保页面内容至少占满视口高度。
头部样式: 设置头部背景颜色和文本颜色。
菜单样式: 设置菜单的背景颜色和菜单项的文本颜色。
主内容区域样式: 设置主内容区域的内边距。
页脚样式: 设置页脚的背景颜色、文本颜色、文本对齐方式和内边距。
-->