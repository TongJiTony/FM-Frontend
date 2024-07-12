<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>Welcome to the home page of Football Manager!</p>
  </div>
</template>
<!--结构: 包含一个根 div 元素，类名为 home，里面有一个 h1 元素和一个 p 元素，显示欢迎消息。-->


<script>
export default {
  name: 'HomePage',
};
</script>
<!--组件定义: 使用 export default 导出一个包含 name 属性的对象，定义组件名称为 HomePage。-->


<style>
/* 这里可以添加Home视图的样式 */
.home {
  padding: 1rem;
}
</style>
<!--样式: 设置了 .home 类的内边距为 1rem。-->