// main.js

/*这个文件是Vue应用的入口文件，初始化Vue实例，并引入了必要的依赖和插件：*/ 
/*
引入依赖：Vue、根组件App.vue、路由router、ElementUI库及其样式。
配置Vue：禁用生产提示，注册ElementUI插件。
初始化Vue实例：创建一个新的Vue实例，并将其挂载到#app元素上，使用render函数渲染根组件。
*/
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueCookies from "vue-cookies";
import 'element-ui/lib/theme-chalk/index.css';

//引入echarts
import * as echarts from 'echarts'
//vue全局注入echarts
Vue.prototype.$echarts = echarts;


import store from './store'; // 引入 Vuex store

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCookies);

//Vue.$cookies.set("isLoggedIn", "false"); // 设置Cookie为false
VueCookies.set("isLoggedIn", "false"); 
VueCookies.set("token", "invalid_token");
// 在 Vue 实例化之前，初始化 isLoggedIn 为 false,token为invalid_token
 store.commit("user/resetUser");//重置登录状态

new Vue({
  router,

  store,

  render: h => h(App),
}).$mount('#app');
