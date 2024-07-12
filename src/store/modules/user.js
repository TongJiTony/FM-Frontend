//这个文件定义了 user 模块，管理用户相关的状态。

//state：定义了用户 ID 和用户名两个状态变量。
//mutations：定义了两个用于更新状态的方法，分别用于更新用户 ID 和用户名。
export default {
  namespaced: true,
  state: {
    id: 0,//用户ID
    name: ''//用户名
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
