<template>
  <el-dialog
    :title="!dataForm.teamId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="球队名称" prop="teamName">
      <el-input v-model="dataForm.teamName" placeholder="球队名称"></el-input>
    </el-form-item>
    <el-form-item label="成立时间" prop="establishedDate">
      <el-input v-model="dataForm.establishedDate" placeholder="成立时间"></el-input>
    </el-form-item>
    <el-form-item label="主教练" prop="headCoach">
      <el-input v-model="dataForm.headCoach" placeholder="主教练"></el-input>
    </el-form-item>
    <el-form-item label="所在城市" prop="city">
      <el-input v-model="dataForm.city" placeholder="所在城市"></el-input>
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
        teamName: '',
        establishedDate: '',
        headCoach: '',
        city: '',
        teamId: 0,
      },
      dataRule: {
        teamName: [
          { required: true, message: '球队名称不能为空', trigger: 'blur' }
        ],
        establishedDate: [
          { required: true, message: '成立时间不能为空', trigger: 'blur' }
        ],
        headCoach: [
          { required: true, message: '主教练不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '所在城市不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.teamId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.teamId) {
          axios.get(`/api/admin/teams/info/${this.dataForm.teamId}`)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.teamName = data.teams.teamName;
                  this.dataForm.establishedDate = data.teams.establishedDate;
                  this.dataForm.headCoach = data.teams.headCoach;
                  this.dataForm.city = data.teams.city;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/admin/teams/${!this.dataForm.teamId ? 'save' : 'update'}`, {
            teamName: this.dataForm.teamName,
            establishedDate: this.dataForm.establishedDate,
            headCoach: this.dataForm.headCoach,
            city: this.dataForm.city,
            teamId: this.dataForm.teamId || undefined,
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