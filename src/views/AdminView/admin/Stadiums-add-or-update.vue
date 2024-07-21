<template>
  <el-dialog
    :title="!dataForm.stadiumId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="体育馆名称" prop="stadiumName">
      <el-input v-model="dataForm.stadiumName" placeholder="体育馆名称"></el-input>
    </el-form-item>
    <el-form-item label="观众容量" prop="stadiumCapacity">
      <el-input v-model="dataForm.stadiumCapacity" placeholder="观众容量"></el-input>
    </el-form-item>
    <el-form-item label="体育馆地址" prop="stadiumLocation">
      <el-input v-model="dataForm.stadiumLocation" placeholder="体育馆地址"></el-input>
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
        stadiumId: 0,
        stadiumName: '',
        stadiumCapacity: '',
        stadiumLocation: ''
      },
      dataRule: {
        stadiumName: [
          { required: true, message: '体育馆名称不能为空', trigger: 'blur' }
        ],
        stadiumCapacity: [
          { required: true, message: '观众容量不能为空', trigger: 'blur' }
        ],
        stadiumLocation: [
          { required: true, message: '体育馆地址不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.stadiumId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.stadiumId) {
          axios.get(`/api/admin/stadiums/info/${this.dataForm.stadiumId}`)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.stadiumName = data.stadiums.stadiumName;
                  this.dataForm.stadiumCapacity = data.stadiums.stadiumCapacity;
                  this.dataForm.stadiumLocation = data.stadiums.stadiumLocation;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/admin/stadiums/${!this.dataForm.stadiumId ? 'save' : 'update'}`, {
            stadiumId: this.dataForm.stadiumId || undefined,
            stadiumName: this.dataForm.stadiumName,
            stadiumCapacity: this.dataForm.stadiumCapacity,
            stadiumLocation: this.dataForm.stadiumLocation
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