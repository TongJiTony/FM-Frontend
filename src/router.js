//这个文件配置了Vue Router，定义了应用的路由规则
import Vue from "vue";
import Router from "vue-router";
import DefaultLayout from "@/layouts/defaultLayout.vue";
import AdminLayout from "@/views/AdminView/AdminLayout.vue";

//使用Router插件：在Vue中注册Router插件。
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/HomePage.vue"),
        },
        {
          path: "test",
          name: "Test",
          component: () => import("@/views/TestView/TestPage.vue"),
        },
        {
          path: "team",
          name: "Team",
          component: () => import("@/views/TeamView/TeamList.vue"),
        },
        {
          path: "/teamdetail/:teamID",
          name: "TeamPage",
          component: () => import("@/views/TeamView/TeamDetail.vue"),
        },
        {
          path: "/player-list/:teamId?",
          name: "PlayerList",
          component: () => import("@/views/PlayerView/PlayerList.vue"),
        },
        {
          path: "/player-display/:playerId",
          name: "PlayerDisplay",
          component: () => import("@/views/PlayerView/PlayerDisplay.vue"),
        },
        {
          path: "/lineup/:teamID?",
          name: "lineup",
          component: () => import("@/views/LineupView/LineupView.vue"),
        },
        {
          path: "/lineupDetail/:lineupId",
          name: "lineupDetail",
          component: () => import("@/views/LineupView/LineupDetail.vue"),
        },
        {
          path: "changepsw",
          name: "Changepsw",
          component: () => import("@/views/UserSetting/ChangePassword.vue"),
        },
        {
          path: "userInfo",
          name: "UserInfo",
          component: () => import("@/views/UserSetting/UserInfo.vue"),
        },
      ],
    },
    {
      //登录路径被移动到根路径下，而不是作为子路由。
      path: "login",
      name: "Login",
      component: () => import("@/views/LoginView/LoginPage.vue"),
    },
    {
      //注册账户路径
      path: "register",
      name: "Register",
      component: () => import("@/views/RegisterView/RegisterPage.vue"),
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "matches",
          name: "Matches",
          component: () => import("@/views/AdminView/admin/Matches-admin.vue"),
        },
        {
          path: "players",
          name: "Players",
          component: () => import("@/views/AdminView/admin/Players-admin.vue"),
        },
        {
          path: "records",
          name: "Records",
          component: () => import("@/views/AdminView/admin/Records-admin.vue"),
        },
        {
          path: "stadiums",
          name: "Stadiums",
          component: () => import("@/views/AdminView/admin/Stadiums-admin.vue"),
        },
        {
          path: "teams",
          name: "Teams",
          component: () => import("@/views/AdminView/admin/Teams-admin.vue"),
        },
        {
          path: "users",
          name: "Users",
          component: () => import("@/views/AdminView/admin/Users-admin.vue"),
        },
      ],
    },
    {
      path: "*", // 捕获所有未匹配的路径
      name: "error-404",
      component: () => import("@/views/ErrorView/error-404.vue"),
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
  const isLoggedIn = Vue.$cookies.get("isLoggedIn");
  console.log("isLoggedIn status:", isLoggedIn);
  if (
    //如果当前未登录并且没有前往登陆界面或者注册界面
    to.name !== "Login" &&
    to.name !== "Register" &&
    isLoggedIn !== "true"
  ) {
    next({ name: "Login" }); //导航守卫中用于中断当前导航并重定向到名为 LoginPage 的路由的方法
  } else if (to.name === "Login" && isLoggedIn === "true") {
    next({ name: "Home" }); // 已登录时重定向到首页
  } else {
    next();
  }
});

export default router;