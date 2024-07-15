<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">FootballManager</h2>
          <p class="brand-info__intro">
            footballManager基于vue、element-ui构建开发的提供给足球经理的一套解决方案
          </p>
        </div>
        <div class="login-main">
          <h3 class="login-title">登录页面</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userID">
              <el-input
                v-model="dataForm.userID"
                placeholder="帐号ID"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="dataForm.password"
                type="password"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                class="login-btn-submit"
                type="primary"
                @click="dataFormSubmit()"
                >登录</el-button
              >
              <el-button
                class="login-btn-submit"
                type="primary"
                @click="dataFormSubmit()"
                >注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  data() {
    return {
      dataForm: {
        userID: "",
        password: "",
        uuid: "",
        captcha: "",
      },
      dataRule: {
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
    // 获取验证码
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
