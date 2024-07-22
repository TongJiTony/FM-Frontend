<template>
  <el-dialog
    :title="!dataForm.teamId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="球队名称" prop="TEAM_NAME">
      <el-input v-model="dataForm.teamName" placeholder="球队名称"></el-input>
    </el-form-item>
    <el-form-item label="成立时间" prop="ESTABLISHED_DATE">
      <el-input v-model="dataForm.establishedDate" placeholder="成立时间"></el-input>
    </el-form-item>
    <el-form-item label="主教练" prop="HEAD_COACH">
      <el-input v-model="dataForm.headCoach" placeholder="主教练"></el-input>
    </el-form-item>
    <el-form-item label="所在城市" prop="CITY">
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
          axios.get(`/api/v1/team/displayone`,
              {
                params: {
                  teamId: this.dataForm.teamId
                }
              })
              .then(({ data }) => {
                if (data[0]) {
                  this.dataForm.teamName = data[0].TEAM_NAME;
                  this.dataForm.establishedDate = data[0].ESTABLISHED_DATE;
                  this.dataForm.headCoach = data[0].HEAD_COACH;
                  this.dataForm.city = data[0].CITY
                  ;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const isUpdate = !!this.dataForm.teamId;
          const url = `/api/v1/team/${isUpdate ? `update?updateTeamid=${String(this.dataForm.teamId)}` : 'add'}`;
          const payload = {
            team_name: this.dataForm.teamName,
            established_date: this.dataForm.establishedDate,
            head_coach: this.dataForm.headCoach,
            city: this.dataForm.city
          };
          if (isUpdate) {
            payload.team_id = String(this.dataForm.teamId);
          }
          axios.post(url, payload, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
                }
              });
          });
        }
      });
    }
  }
};
</script>