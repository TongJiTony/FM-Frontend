<template>
  <div class="change-password-container">
    <h3>修改密码</h3>
    <el-form :model="passwordForm" ref="passwordForm" :rules="rules" label-width="120px" @submit.native.prevent="savePassword">
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input type="password" v-model="passwordForm.currentPassword" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input type="password" v-model="passwordForm.confirmPassword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePassword">保存修改</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
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
              this.$router.push({ name: 'Home' });
            } 
            else {
              this.$message.error(response.data.msg);
            }
          } 
          else {
            console.log('校验失败');
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
.change-password-container {
  padding: 20px;
}
</style>
