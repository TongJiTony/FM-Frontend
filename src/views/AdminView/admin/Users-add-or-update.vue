<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="${column.comments}" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="${column.comments}"></el-input>
    </el-form-item>
    <el-form-item label="${column.comments}" prop="userRight">
      <el-input v-model="dataForm.userRight" placeholder="${column.comments}"></el-input>
    </el-form-item>
    <el-form-item label="${column.comments}" prop="userPassword">
      <el-input v-model="dataForm.userPassword" placeholder="${column.comments}"></el-input>
    </el-form-item>
    <el-form-item label="${column.comments}" prop="userPhone">
      <el-input v-model="dataForm.userPhone" placeholder="${column.comments}"></el-input>
    </el-form-item>
    <el-form-item label="${column.comments}" prop="icon">
      <el-input v-model="dataForm.icon" placeholder="${column.comments}"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        userId: 0,
        userName: '',
        userRight: '',
        userPassword: '',
        userPhone: '',
        icon: ''
      },
      dataRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        userRight: [
          { required: true, message: '用户权限不能为空', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '用户电话不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '用户图标不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.userId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.userId) {
          axios.get(`/api/admin/users/info/${this.dataForm.userId}`)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.userName = data.users.userName;
                  this.dataForm.userRight = data.users.userRight;
                  this.dataForm.userPassword = data.users.userPassword;
                  this.dataForm.userPhone = data.users.userPhone;
                  this.dataForm.icon = data.users.icon;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/admin/users/${!this.dataForm.userId ? 'save' : 'update'}`, {
            userId: this.dataForm.userId || undefined,
            userName: this.dataForm.userName,
            userRight: this.dataForm.userRight,
            userPassword: this.dataForm.userPassword,
            userPhone: this.dataForm.userPhone,
            icon: this.dataForm.icon
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>