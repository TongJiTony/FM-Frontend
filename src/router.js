//这个文件配置了Vue Router，定义了应用的路由规则
import Vue from "vue";
import Router from "vue-router";
import DefaultLayout from "@/layouts/defaultLayout.vue";
import Login from "@/views/common/LoginPage.vue";
//import LoginPage from "@/views/LoginView/LoginPage.vue";
//import { component } from "vue/types/umd";
//引入依赖：Vue、Router、DefaultLayout组件。

//使用Router插件：在Vue中注册Router插件。
Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: Login,
                },
                {
                    path: '',
                    name: 'Home',
                    component: () => import('@/views/HomePage.vue'),
                },
                {
                    path: 'test',
                    name: 'Test',
                    component: () => import('@/views/TestView/TestPage.vue'),
                },
                {
                    path: 'player-list',
                    name: 'PlayerList',
                    component: () => import('@/views/PlayerView/PlayerList.vue'),
                },
                {
                    path: '/player-display/:playerId', // 添加 playerId 参数
                    name: 'PlayerDisplay',
                    component: () => import('@/views/PlayerView/PlayerDisplay.vue'),
                },

            ],
        },
    ],
});



// 导航守卫
/*
to：即将要进入的目标路由对象。
from：当前导航正要离开的路由对象。
next：一个函数，调用它来决定接下来的行为。
*/
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (to.name !== "Login" && isLoggedIn === "false") {
    next({ name: "Login" }); //导航守卫中用于中断当前导航并重定向到名为 LoginPage 的路由的方法
  } else {
    next();
  }
});

export default router;