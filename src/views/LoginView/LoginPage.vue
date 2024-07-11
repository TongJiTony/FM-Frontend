<!--在LoginPage.vue中编写登录表单，并使用ElementUI提供的表单组件和样式。-->
<!--在LoginPage.vue中编写登录逻辑，处理表单提交，并与后端API进行交互。-->
<template>
  <div class="login-container">
    <el-form @submit.native.prevent="handleLogin" ref="loginForm">
      <el-form-item label="Username">
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<!--
这个部分定义了一个登录表单，使用了 Element UI 提供的表单组件。表单包括两个输入项和一个按钮：

el-form 是表单容器。@submit.native.prevent="handleLogin" 事件监听器防止表单的默认提交行为并调用 handleLogin 方法。
el-form-item 用来包装表单项。
el-input 是输入框组件，v-model 用于数据绑定。
el-button 是按钮组件，点击时调用 handleLogin 方法。
-->

<script>
export default {
  name: "LoginPage",
  data() {
    //data 函数定义了组件的数据，包含两个字段 username 和 password。
    return {
      username: "",
      password: "",
    };
  },

  /*
  methods 对象包含了一个方法 handleLogin，用于处理登录逻辑：
  如果用户名是 'admin' 且密码是 'password'，则模拟获取一个 token，并将其存储在 localStorage 中，然后重定向到主页。
  否则，显示错误消息。
  */
  methods: {
    handleLogin() {
      //在登录方法handleLogin中，检查用户名和密码是否正确。如果登录成功，将isLoggedIn设置为true
      if (this.username === 'admin' && this.password === 'password') {
     
        // 假设后端API返回一个token

        localStorage.setItem("isLoggedIn", "true"); 
        // 将键名为 'isLoggedIn' 的 localStorage 存储项的值设置为字符串 "true",设置登录状态为 true
        //这是 HTML5 提供的 Web Storage API 中的一部分，它允许网页在浏览器中保存数据。
        console.log("Login successful, current path:", this.$route.path); //控制台检查
        if (this.$route.path != "/") {
            this.$router.push("/");
        }
      } else {
            this.$message.error("Invalid username or password"); // 登录失败，显示错误消息
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f2f2f2;
}
</style>
<!--使用 scoped 关键字确保样式只应用于当前组件。样式定义了 .login-container 的样式，使其居中显示并占满整个视窗高度，背景色为浅灰色。-->
