<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="userName" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="userName"></el-input>
    </el-form-item>
    <el-form-item label="userRight" prop="userRight">
      <el-input v-model="dataForm.userRight" placeholder="userRight"></el-input>
    </el-form-item>
    <el-form-item label="USER_PASSWORD" prop="USER_PASSWORD">
      <el-input v-model="dataForm.userPassword" placeholder="USER_PASSWORD"></el-input>
    </el-form-item>
    <el-form-item label="USER_PHONE" prop="USER_PHONE">
      <el-input v-model="dataForm.userPhone" placeholder="USER_PHONE"></el-input>
    </el-form-item>
    <el-form-item label="ICON" prop="ICON">
      <el-input v-model="dataForm.icon" placeholder="ICON"></el-input>
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
          axios.get(`/api/v1/user/displayone`,
          {
            params: {
              userId: this.dataForm.userId
            }
          })
              .then(({ data }) => {
                if (data[0]) {
                  console.log(data[0])
                  this.dataForm.userName = data[0].USER_NAME;
                  this.dataForm.userRight = data[0].USER_RIGHT;
                  this.dataForm.userPassword = data[0].USER_PASSWORD;
                  this.dataForm.userPhone = data[0].USER_PHONE;
                  this.dataForm.icon = data[0].ICON;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/v1/user/${!this.dataForm.userId ? 'add' : 'admin/changeAttributes'}`, {
            userId: this.dataForm.userId || undefined,
            userName: this.dataForm.userName,
            userRight: this.dataForm.userRight,
            userPassword: this.dataForm.userPassword,
            userPhone: this.dataForm.userPhone,
            icon: this.dataForm.icon
          }).then(({ data }) => {
            console.log(data)
            if (data && data.code === 200) {
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