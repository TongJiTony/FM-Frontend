<template>
  <el-dialog
    :title="!dataForm.playerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="playerName" prop="playerName">
      <el-input v-model="dataForm.playerName" placeholder="playerName"></el-input>
    </el-form-item>
    <el-form-item label="birthday" prop="birthday">
      <el-input v-model="dataForm.birthday" placeholder="birthday"></el-input>
    </el-form-item>
    <el-form-item label="teamId" prop="teamId">
      <el-input v-model="dataForm.teamId" placeholder="teamId"></el-input>
    </el-form-item>
    <el-form-item label="role" prop="role">
      <el-input v-model="dataForm.role" placeholder="role"></el-input>
    </el-form-item>
    <el-form-item label="usedFoot" prop="usedFoot">
      <el-input v-model="dataForm.usedFoot" placeholder="usedFoot"></el-input>
    </el-form-item>
    <el-form-item label="healthState" prop="healthState">
      <el-input v-model="dataForm.healthState" placeholder="healthState"></el-input>
    </el-form-item>
    <el-form-item label="rank" prop="rank">
      <el-input v-model="dataForm.rank" placeholder="rank"></el-input>
    </el-form-item>
    <el-form-item label="gameState" prop="gameState">
      <el-input v-model="dataForm.gameState" placeholder="gameState"></el-input>
    </el-form-item>
    <el-form-item label="transState" prop="transState">
      <el-input v-model="dataForm.transState" placeholder="transState"></el-input>
    </el-form-item>
    <el-form-item label="isShow" prop="isShow">
      <el-input v-model="dataForm.isShow" placeholder="isShow"></el-input>
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
        playerId: 0,
        playerName: '',
        birthday: '',
        teamId: '',
        role: '',
        usedFoot: '',
        healthState: '',
        rank: '',
        gameState: '',
        transState: '',
        isShow: ''
      },
      dataRule: {
        playerName: [
          { required: true, message: 'playerName不能为空', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: 'birthday不能为空', trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: 'teamId不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'role不能为空', trigger: 'blur' }
        ],
        usedFoot: [
          { required: true, message: 'usedFoot不能为空', trigger: 'blur' }
        ],
        healthState: [
          { required: true, message: 'healthState不能为空', trigger: 'blur' }
        ],
        rank: [
          { required: true, message: 'rank不能为空', trigger: 'blur' }
        ],
        gameState: [
          { required: true, message: 'gameState不能为空', trigger: 'blur' }
        ],
        transState: [
          { required: true, message: 'transState不能为空', trigger: 'blur' }
        ],
        isShow: [
          { required: true, message: 'isShow不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.playerId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.playerId) {
          axios.get(`/api/admin/players/info/${this.dataForm.playerId}`)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.playerName = data.players.playerName;
                  this.dataForm.birthday = data.players.birthday;
                  this.dataForm.teamId = data.players.teamId;
                  this.dataForm.role = data.players.role;
                  this.dataForm.usedFoot = data.players.usedFoot;
                  this.dataForm.healthState = data.players.healthState;
                  this.dataForm.rank = data.players.rank;
                  this.dataForm.gameState = data.players.gameState;
                  this.dataForm.transState = data.players.transState;
                  this.dataForm.isShow = data.players.isShow;
                }
              });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post(`/api/admin/players/${!this.dataForm.playerId ? 'save' : 'update'}`, {
            playerId: this.dataForm.playerId || undefined,
            playerName: this.dataForm.playerName,
            birthday: this.dataForm.birthday,
            teamId: this.dataForm.teamId,
            role: this.dataForm.role,
            usedFoot: this.dataForm.usedFoot,
            healthState: this.dataForm.healthState,
            rank: this.dataForm.rank,
            gameState: this.dataForm.gameState,
            transState: this.dataForm.transState,
            isShow: this.dataForm.isShow
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
