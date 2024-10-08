<template>
  <div class="change-password-page">
    <div class="change-password-container">
      <h2>修改密码</h2>
      <el-form :model="passwordForm" ref="passwordForm" :rules="rules" label-width="120px" @submit.native.prevent="savePassword">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input type="password" v-model="passwordForm.currentPassword" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            type="password" 
            v-model="passwordForm.newPassword" 
            placeholder="请输入新密码"
            @input="checkPasswordStrength" 
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePassword">保存修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="additional-content">
      <img src="@/assets/img/FM-Logo-2.png" alt="Inspirational Content" class="inspirational-image"/>

      <div class="password-tips">
        <h4>创建强密码的技巧</h4>
        <ul>
          <li>使用至少8个字符</li>
          <li>包含大小写字母、数字和特殊字符</li>
          <li>避免使用常见的词汇和信息</li>
        </ul>
      </div>
      <div class="password-strength">
        <h4>密码强度</h4>
        <div class="strength-bar">
          <div :style="strengthBarStyle" class="strength-bar-fill"></div>
        </div>
        <p>{{ passwordStrengthMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      passwordForm: {
        user_id: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordStrengthMessage: '',
      strengthBarStyle: {
        width: '0%',
        backgroundColor: '#ccc'
      },
      rules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters('user', ['getUserId']),
  },
  methods: {
    async savePassword() {
      try {
        const userId = this.getUserId;
        console.log("从 Vuex 获取的用户ID:", userId);
        console.log('请求数据:', {
          user_id: userId,
          user_password: this.passwordForm.currentPassword,
          new_password: this.passwordForm.newPassword
        });

        this.$refs.passwordForm.validate(async (valid) => {
          if (valid) {
            const response = await axios.post('/api/v1/user/changePassword', {
              user_id: userId,
              user_password: this.passwordForm.currentPassword,
              new_password: this.passwordForm.newPassword
            });

            if (response.data.code === 200) {
              this.$message.success('密码修改成功');
              this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              };
              this.$router.replace({ name: 'Home' });
            } else {
              this.$message.error(response.data.msg);
            }
          } else {
            this.$message.error("校验失败");
          }
        });

      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$message.error('请求错误：' + error.response.data.msg);
        } else if (error.response && error.response.status === 500) {
          this.$message.error('服务器错误：' + error.response.data.msg);
        } else {
          this.$message.error('修改失败，请稍后再试');
        }
        console.error("错误详情:", error);
      }
    },
    cancel() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('确认密码与新密码不匹配'));
      } else {
        callback();
      }
    },
    checkPasswordStrength() {
      const password = this.passwordForm.newPassword;
      let strength = 0;

      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/\d/.test(password)) strength += 1;
      if (/[@$!%*?&#]/.test(password)) strength += 1;

      this.setPasswordStrength(strength);
    },
    setPasswordStrength(strength) {
      switch (strength) {
        case 1:
          this.passwordStrengthMessage = '非常弱';
          this.strengthBarStyle = { width: '20%', backgroundColor: 'red' };
          break;
        case 2:
          this.passwordStrengthMessage = '弱';
          this.strengthBarStyle = { width: '40%', backgroundColor: 'orange' };
          break;
        case 3:
          this.passwordStrengthMessage = '中等';
          this.strengthBarStyle = { width: '60%', backgroundColor: 'yellow' };
          break;
        case 4:
          this.passwordStrengthMessage = '强';
          this.strengthBarStyle = { width: '80%', backgroundColor: 'lightgreen' };
          break;
        case 5:
          this.passwordStrengthMessage = '非常强';
          this.strengthBarStyle = { width: '100%', backgroundColor: 'green' };
          break;
        default:
          this.passwordStrengthMessage = '';
          this.strengthBarStyle = { width: '0%', backgroundColor: '#ccc' };
      }
    }
  }
};
</script>

<style scoped>
.change-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}

.change-password-container {
  width: 800px; 
  margin-right: 20px;
}

.additional-content {
  flex: 1;
  padding: 20px;
  max-width: 400px;
}

.inspirational-image {
  width: 100%;
  height: auto;
  margin-left: 50px;
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 10px;
  margin-top:0px
}

.password-tips {
  font-size: 14px;
  color: #000000;
}

.password-strength {
  margin-top: 20px;
}

.strength-bar {
  width: 100%;
  height: 10px;
  background-color: #ccc;
  border-radius: 5px;
  margin: 10px 0;
}

.strength-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

:deep(.el-form-item__label) {
  color: #000000 !important;
  font-size: large;
  font-weight: bold;
}
</style>
