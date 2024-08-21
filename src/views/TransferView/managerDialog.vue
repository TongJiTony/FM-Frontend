<template>
    <el-dialog :visible="visible" @close="closeDialog">
      <el-row class="chat-box" divider>
        <!-- 左侧：用户1信息 -->
        <el-col :span="4" class="user-info">
          <el-card>
            <img src="user1-avatar.jpg" alt="User 1" class="avatar">
            <p>User 1</p>
          </el-card>
        </el-col>

        <!-- 中间：对话内容 -->
        <el-col :span="14" class="chat-content" offset="1">
          <div>
            <label for="transfer-date">转会日期:</label>
            <el-input id="transfer-date" v-model="transferInfo.transferDate" placeholder="请输入转会日期"></el-input>
          </div>
          <div>
            <label for="transfer-fee">转会费:</label>
            <el-input id="transfer-fee" v-model="transferInfo.transferFee" placeholder="请输入转会费"></el-input>
          </div>
          
        </el-col>

        <!-- 右侧：用户2信息 -->
        <el-col :span="4" class="user-info" offset="1">
          <el-card>
            <img src="user1-avatar.jpg" alt="User 1" class="avatar">
            <p>User 2</p>
          </el-card>
        </el-col>
      </el-row>


      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel = false">取消</el-button>
        <el-button type="primary" @click="saveTransfer">确认</el-button>
      </div>      

    </el-dialog>
</template>


<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({ transferDate: '', transferFee: 0 })
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    saveTransfer() {
      this.$emit('save', this.transferInfo);
    },
    handleCancel() {
      this.$emit('close');
    },
  },
  computed: {
    isDialogVisible() {
      return this.visible;
    },
    transferInfo: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit('input', newVal);
      }
    },
  },
};
</script>

<style scoped>

</style>