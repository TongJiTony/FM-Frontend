<template>
  <el-dialog
    :title="!dataForm.playerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="PLAYER_NAME" prop="PLAYER_NAME">
      <el-input v-model="dataForm.playerName" placeholder="playerName"></el-input>
    </el-form-item>
    <el-form-item label="BIRTHDAY" prop="BIRTHDAY">
      <el-input v-model="dataForm.birthday" placeholder="birthday"></el-input>
    </el-form-item>
    <el-form-item label="TEAM_ID" prop="TEAM_ID">
      <el-input v-model="dataForm.teamId" placeholder="teamId"></el-input>
    </el-form-item>
    <el-form-item label="ROLE" prop="ROLE">
      <el-input v-model="dataForm.role" placeholder="role"></el-input>
    </el-form-item>
    <el-form-item label="USED_FOOT" prop="USED_FOOT">
      <el-input v-model="dataForm.usedFoot" placeholder="usedFoot"></el-input>
    </el-form-item>
    <el-form-item label="HEALTH_STATE" prop="HEALTH_STATE">
      <el-input v-model="dataForm.healthState" placeholder="healthState"></el-input>
    </el-form-item>
    <el-form-item label="RANK" prop="RANK">
      <el-input v-model="dataForm.rank" placeholder="rank"></el-input>
    </el-form-item>
    <el-form-item label="GAME_STATE" prop="GAME_STATE">
      <el-input v-model="dataForm.gameState" placeholder="gameState"></el-input>
    </el-form-item>
    <el-form-item label="TRANS_STATE" prop="TRANS_STATE">
      <el-input v-model="dataForm.transState" placeholder="transState"></el-input>
    </el-form-item>
    <el-form-item label="IS_SHOW" prop="IS_SHOW">
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
          axios.get(`/api/v1/player/displayone`,{
            params: {
              playerid: this.dataForm.playerId
            }
          })
              .then(({ data }) => {
                if (data[0]) {
                  this.dataForm.playerId = data[0].PLAYER_ID;
                  this.dataForm.playerName = data[0].PLAYER_NAME;
                  this.dataForm.birthday = data[0].BIRTHDAY;
                  this.dataForm.teamId = data[0].TEAM_ID;
                  this.dataForm.role = data[0].ROLE;
                  this.dataForm.usedFoot = data[0].USED_FOOT;
                  this.dataForm.healthState = data[0].HEALTH_STATE;
                  this.dataForm.rank = data[0].RANK;
                  this.dataForm.gameState = data[0].GAME_STATE;
                  this.dataForm.transState = data[0].TRANS_STATE;
                  this.dataForm.isShow = data[0].IS_SHOW
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
          const isUpdate = !!this.dataForm.playerId;
          const url = `/api/v1/player/${isUpdate ? `update?playerId=${this.dataForm.playerId}` : 'add'}`;
          const payload = {
            player_name: this.dataForm.playerName,
            birthday: this.dataForm.birthday,
            team_id: Number(this.dataForm.teamId),
            role: String(this.dataForm.role),
            used_foot: Number(this.dataForm.usedFoot),
            health_state: Number(this.dataForm.healthState),
            rank: Number(this.dataForm.rank),
            game_state: Number(this.dataForm.gameState),
            trans_state: Number(this.dataForm.transState),
            is_show: Number(this.dataForm.isShow)
          };
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
