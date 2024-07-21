<template>
  <div id="app">
    <router-view /><!-- Vue Router的路由视图，用于显示当前路由匹配的组件 -->
  </div>
</template>
<!--<template> 标签内部定义了根组件的模板结构。<div id="app"> 是根元素，作为整个应用的容器。
<router-view /> 是一个Vue Router提供的组件，用来展示当前路由对应的页面组件。-->


<script>
export default {
  name: 'App',
};
</script>
<!--<script> 标签内部是组件的逻辑部分，使用 export default 导出一个对象，
其中包含了组件的选项。name 是组件的名称，用于在开发者工具中进行识别和调试。-->


<style>
/* 可以在这里添加全局样式 */
</style>
<!--<style> 标签内部定义了组件的样式。你可以在这里编写全局样式，这些样式将应用到整个应用程序中的所有组件。-->

<!--App.vue 是Vue应用的根组件，负责包裹整个应用的结构，包括定义页面的布局和全局样式。
它通过 <router-view /> 动态地渲染当前路由匹配的组件，使得Vue Router能够实现单页面应用的页面切换效果。-->
