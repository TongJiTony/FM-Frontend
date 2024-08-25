export default {
  namespaced: true,
  state: {
    user_id: 0, // 用户ID
    user_name: "", // 用户名
    user_right: "", // 用户权限
    user_phone: "", // 用户电话
    user_icon: "", // 用户头像
    user_delete_icon: "", //删除头像
    user_teamid: ""
  },
  mutations: {
    setUser(state, user) {
      state.user_id = user.user_id;
      state.user_name = user.user_name;
      state.user_right = user.user_right;
      state.user_phone = user.user_phone;
      state.user_icon = user.user_icon;
      state.user_delete_icon = user.user_delete_icon;
      state.user_teamid = user.user_teamid;
    },
    resetUser(state) {
      state.user_id = 0; // 用户ID
      state.user_name = ""; // 用户名
      state.user_right = "";
      state.user_phone = "";
      state.user_icon = "";
      state.user_delete_icon = "";
      state.user_teamid= "";
    },
    updateUserId(state, id) {
      state.user_id = id;
    },
    updatePhone(state, newPhone) {
      state.user_phone = newPhone;
    },
    updateIcon(state, newIcon) {
      state.user_icon = newIcon;
    },
    updateUserName(state, name) {
      state.user_name = name;
    },
    updateRight(state, right) {
      state.user_right = right;
    },
    updateDeleteIcon(state, delete_icon) {
      state.user_delete_icon = delete_icon;
    },
    updateTeamID(state, team_id){
      state.user_teamid = team_id;
    }
  },
  getters: {
    //获取用户信息
    getUserInfo: (state) => {
      return {
        user_id: state.user_id,
        user_name: state.user_name,
        user_right: state.user_right,
        user_phone: state.user_phone,
        user_icon: state.user_icon,
        user_delete_icon: state.user_delete_icon,
      };
    },
    //获取用户名
    getUserName: (state) => {
      return state.user_name;
    },
    getUserRight: (state) => {
      return state.user_right;
    },
    getUserPhone: (state) => {
      return state.user_phone;
    },
    getUserIcon: (state) => {
      return state.user_icon;
    },
    getUserId: (state) => {
      return state.user_id;
    },
    getDeleteIcon: (state) => {
      return state.user_delete_icon;
    },
    getTeamID: (state) => {
      return state.user_teamid;
    }
  },
};
