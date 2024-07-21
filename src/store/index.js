//这个index.js文件是 Vuex 状态管理的主入口，负责初始化 Vuex 并配置各个模块。
import Vue from "vue";
import Vuex from "vuex";
import cloneDeep from "lodash/cloneDeep";
import common from "./modules/common";
import user from "./modules/user";
//引入必要的依赖：Vue、Vuex、cloneDeep、以及两个模块 common 和 user。

Vue.use(Vuex);//注册 Vuex 插件。

export default new Vuex.Store({
  //创建并导出一个新的 Vuex.Store 实例。
  modules: {
    //配置 modules：将 common 和 user 模块注册到 Vuex。
    common,
    user,
  },
  mutations: {
    //定义 mutations：包括 resetStore 用于重置 Vuex 本地存储状态。
    // 重置vuex本地储存状态
    resetStore(state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG["storeState"][key]);
      });
    },
  },
  strict: process.env.NODE_ENV !== "production", //配置 strict 模式：在非生产环境中启用严格模式。
});
