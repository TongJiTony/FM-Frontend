<template>
  <el-dialog
    :title="!dataForm.matchId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="比赛日期" prop="matchDate">
      <el-input v-model="dataForm.matchDate" placeholder="比赛日期"></el-input>
    </el-form-item>
    <el-form-item label="比赛地点" prop="matchStadium">
      <el-input v-model="dataForm.matchStadium" placeholder="比赛地点"></el-input>
    </el-form-item>
    <el-form-item label="主场球队ID" prop="homeTeamId">
      <el-input v-model="dataForm.homeTeamId" placeholder="主场球队ID"></el-input>
    </el-form-item>
    <el-form-item label="客场球队ID" prop="awayTeamId">
      <el-input v-model="dataForm.awayTeamId" placeholder="客场球队ID"></el-input>
    </el-form-item>
    <el-form-item label="主场得分" prop="homeTeamScore">
      <el-input v-model="dataForm.homeTeamScore" placeholder="主场得分"></el-input>
    </el-form-item>
    <el-form-item label="客场得分" prop="awayTeamScore">
      <el-input v-model="dataForm.awayTeamScore" placeholder="客场得分"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import axios from "axios";

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          matchId: 0,
          matchDate: '',
          matchStadium: '',
          homeTeamId: '',
          awayTeamId: '',
          homeTeamScore: '',
          awayTeamScore: ''
        },
        dataRule: {
          matchDate: [
            { required: true, message: '比赛日期不能为空', trigger: 'blur' }
          ],
          matchStadium: [
            { required: true, message: '比赛地点不能为空', trigger: 'blur' }
          ],
          homeTeamId: [
            { required: true, message: '主场球队ID不能为空', trigger: 'blur' }
          ],
          awayTeamId: [
            { required: true, message: '客场球队ID不能为空', trigger: 'blur' }
          ],
          homeTeamScore: [
            { required: true, message: '主场得分不能为空', trigger: 'blur' }
          ],
          awayTeamScore: [
            { required: true, message: '客场得分不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.matchId = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.matchId) {
            axios.get(`/api/admin/matches/info/${this.dataForm.matchId}`)
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    this.dataForm.matchDate = data.matches.matchDate;
                    this.dataForm.matchStadium = data.matches.matchStadium;
                    this.dataForm.homeTeamId = data.matches.homeTeamId;
                    this.dataForm.awayTeamId = data.matches.awayTeamId;
                    this.dataForm.homeTeamScore = data.matches.homeTeamScore;
                    this.dataForm.awayTeamScore = data.matches.awayTeamScore;
                  }
                });
          }
        });
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/api/admin/matches/${!this.dataForm.matchId ? 'save' : 'update'}`, {
              matchId: this.dataForm.matchId || undefined,
              matchDate: this.dataForm.matchDate,
              matchStadium: this.dataForm.matchStadium,
              homeTeamId: this.dataForm.homeTeamId,
              awayTeamId: this.dataForm.awayTeamId,
              homeTeamScore: this.dataForm.homeTeamScore,
              awayTeamScore: this.dataForm.awayTeamScore
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
  }
</script>