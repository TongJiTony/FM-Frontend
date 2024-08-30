<template>
  <div class="change-password-page">
    <div class="change-password-container">
      <h3>修改密码</h3>
      <el-form :model="passwordForm" ref="passwordForm" :rules="rules" label-width="120px" @submit.native.prevent="savePassword">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input type="password" v-model="passwordForm.currentPassword" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码" />
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

        // 校验表单
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
            } 
            else {
              this.$message.error(response.data.msg);
            }
          } 
          else {
            this.$message.error("校验失败");
          }
        });

      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$message.error('请求错误：' + error.response.data.msg);
        } 
        else if (error.response && error.response.status === 500) {
          this.$message.error('服务器错误：' + error.response.data.msg);
        } 
        else {
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
  max-width: 250px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.password-tips {
  font-size: 14px;
  color: #000000;
}

:deep(.el-form-item__label) {
    color: #131313 !important;
    font-size: large;
}

</style>
