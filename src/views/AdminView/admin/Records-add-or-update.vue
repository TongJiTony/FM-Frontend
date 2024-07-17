<template>
  <el-dialog
    :title="!dataForm.recordId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="teamId" prop="teamId">
      <el-input v-model="dataForm.teamId" placeholder="teamId"></el-input>
    </el-form-item>
    <el-form-item label="transactionDate" prop="transactionDate">
      <el-input v-model="dataForm.transactionDate" placeholder="transactionDate"></el-input>
    </el-form-item>
    <el-form-item label="amount" prop="amount">
      <el-input v-model="dataForm.amount" placeholder="amount"></el-input>
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-input v-model="dataForm.description" placeholder="description"></el-input>
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
        recordId: 0,
        teamId: '',
        transactionDate: '',
        amount: '',
        description: ''
      },
      dataRule: {
        teamId: [
          { required: true, message: 'teamId不能为空', trigger: 'blur' }
        ],
        transactionDate: [
          { required: true, message: 'transactionDate不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: 'amount不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'description不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.recordId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.recordId) {
          axios.get(`/api/admin/records/info/${this.dataForm.recordId}`)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.teamId = data.records.teamId;
                  this.dataForm.transactionDate = data.records.transactionDate;
                  this.dataForm.amount = data.records.amount;
                  this.dataForm.description = data.records.description;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/admin/records/${!this.dataForm.recordId ? 'save' : 'update'}`, {
            recordId: this.dataForm.recordId || undefined,
            teamId: this.dataForm.teamId,
            transactionDate: this.dataForm.transactionDate,
            amount: this.dataForm.amount,
            description: this.dataForm.description
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