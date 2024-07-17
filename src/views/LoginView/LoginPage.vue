<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <!-- brand-info 部分展示了项目名称（FootballManager）和简短介绍 -->
        <div class="brand-info">
          <h2 class="brand-info__text">FootballManager</h2>
          <p class="brand-info__intro">
            footballManager基于vue、element-ui构建开发的提供给足球经理的一套解决方案
          </p>
        </div>
        <!-- 登录主要部分 -->
        <div class="login-main">
          <h3 class="login-title">登录页面</h3>
          <!-- 登录表单 -->
          <!--使用了 el-form 组件来创建表单，并绑定了 dataForm 作为表单的数据模型，dataRule 作为表单的验证规则。-->
          <!--通过 ref="dataForm" 引用表单，方便后续操作。
          ref 是一个引用属性，允许在 Vue 实例中通过 this.$refs.dataForm 访问这个 el-form 实例。-->
          <!--监听 keyup.enter 事件，当用户按下 Enter 键时，调用 dataFormSubmit() 方法提交表单。
          这是一个事件绑定，监听表单中的 keyup 事件，当用户按下 Enter 键时会触发 dataFormSubmit 方法。
          native 修饰符表示直接监听原生的 DOM 事件，而不是 Vue 组件的自定义事件。-->
          <!--status-icon:这是 Element UI 提供的一个属性，当设置为 true 时，在输入框右侧显示表单验证状态的图标（例如成功、失败的图标）。-->
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon="true"
          >
            <!-- 帐号ID输入框 -->
            <!--使用 el-form-item 创建表单项，并通过 prop 属性指定对应的表单数据字段。-->
            <el-form-item prop="userID">
              <!--el-input 用于输入帐号ID、密码和验证码，分别绑定到 dataForm.userID、dataForm.password 和 dataForm.captcha。-->
              <el-input
                v-model="dataForm.userID"
                placeholder="帐号ID"
              ></el-input>
            </el-form-item>
            <!-- 密码输入框 -->
            <el-form-item prop="password">
              <el-input
                v-model="dataForm.password"
                type="password"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <!-- 验证码输入框 -->
            <!--使用 el-row 和 el-col 布局，使验证码输入框和图片并列显示。-->
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <!--img 标签绑定了验证码图片的路径 captchaPath，并在点击时调用 getCaptcha() 方法刷新验证码。-->
                  <img :src="captchaPath" @click="getCaptcha()" alt="" />
                </el-col>
              </el-row>
            </el-form-item>
            <!-- 提交按钮 -->
            <!--使用 el-button 创建提交按钮，并绑定点击事件 dataFormSubmit() 提交表单。-->
            <el-form-item>
              <el-button
                class="login-btn-submit"
                type="primary"
                @click="dataFormSubmit()"
                >登录</el-button
              >
              <el-button
                class="login-btn-register"
                type="text"
                @click="gotoRegister()"
                >没有账号，点击注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<!--在 Vue.js 组件中，<script> 部分用于定义组件的逻辑，包括数据模型、方法、生命周期钩子等。具体来说，<script> 部分通常包含以下内容：-->
<!--导入依赖：从外部库或文件中导入需要的模块或组件。-->
<!--定义数据：定义组件的状态数据，这些数据会被绑定到模板中进行渲染。-->
<!--定义方法：定义处理逻辑的方法，例如表单提交、数据验证、事件处理等。-->
<!--生命周期钩子：定义组件在不同生命周期阶段的逻辑，例如创建、挂载、更新和销毁时的逻辑。-->
<!--组件注册：注册局部组件以供模板中使用。-->

<script>
import { getUUID } from "@/utils";
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  data() {
    return {
      // 表单数据模型
      dataForm: {
        userID: "",
        password: "",
        uuid: "",
        captcha: "",
      },
      // 表单验证规则
      dataRule: {
        /*
        required: true：表示该字段为必填项。
        message: '请输入帐号ID'：当该字段未填写时，显示的提示信息。
        trigger: 'blur'：表示在该字段失去焦点时触发验证。
        */
        userID: [
          { required: true, message: "帐号ID不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
      },
      // 验证码图片路径
      captchaPath: "",
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // 使用 axios 直接发送 POST 请求
          axios
            .post("/api/v1/user/login", {
              user_id: this.dataForm.userID,
              user_password: this.dataForm.password,
            })
            .then(({ data }) => {
              console.log("data.code=", data.code);
              console.log("data.msg=", data.msg);
              if (data.code == 200) {
                // code == 200 表示成功
                VueCookies.set("isLoggedIn", "true", "1h"); // 设置 Cookie
                VueCookies.set("token", data.token);//
                this.$router.replace({ name: "Home" }); // 跳转到主界面
              }
            })
            .catch((error) => {
              console.error(error);
              this.getCaptcha();
              this.$message.error("登录错误，请检查密码");
            });
        }
      });
    },

    //跳转到注册路由
    gotoRegister(){
      this.$router.push({name : 'Register'});//跳转到注册界面
    },

    // 获取验证码和图片路径
    // 调用 API 获取新的验证码路径
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      /*this.captchaPath = this.$http.adornUrl(
        `/api/captcha.jpg?uuid=${this.dataForm.uuid}`
      );*/
    },
  },
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 16px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
}
</style>
