<template>
    <el-dialog :visible="visible" @close="closeDialog"
    :before-close="handleClose"
    width="1200px"
    >
      <el-row style="margin-left: 40px;" divider>
        <!-- 左侧：用户1信息 -->
        <el-col :span="4" class="user-info">
          <el-card>
            <el-image :src="this.randomAvatar"></el-image>
            <h4>manager</h4>
            <h4>转会球员：{{ this.playerName }}</h4>
          </el-card>

          <el-card class="prompts">
            <h3 class="title">对话提示</h3>
            <!-- 放置对话提示内容 -->
            <el-col style="margin-top: 25px">
              <p>依次确定下面的内容</p>
              <p style="color: salmon;">转会费</p>
              <p><span>球员</span><span style="color: salmon;">工资</span></p>
              <p><span style="color: salmon;">转会窗口</span><span >(冬窗/夏窗期)</span></p>
              <p><span style="color: salmon;">合同时长</span><span>(年)</span></p>
            </el-col>
          </el-card>
        </el-col>

        <!-- 中间：对话内容 -->
        <el-col :span="14" class="chat-content" :offset="1">
          <el-card class="chat-box" ref="chatBox">
            <div v-for="(message, index) in messages" :key="index" class="message">
              <p><strong>{{ message.user }}:</strong> {{ message.text }}</p>
            </div>
          </el-card>
          <el-row>
            <el-autocomplete
              type="textarea"
              v-model="input"
              placeholder="输入对话内容"
              class="input-box"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              clearable
              :disabled="input_disabled"
            ></el-autocomplete>
            <el-button type="primary" @click="sendMessage">发送</el-button> 
          </el-row>   
        </el-col>

        <!-- 右侧：用户2信息 -->
        <el-col :span="4" class="user-info" :offset="1">
          <el-card>
            <el-image :src="require('@/assets/img/managerIcon/managerIcon.png')"></el-image>
            <h4>you</h4>
          </el-card>

          <el-card v-if="inputcard_visible" class="prompts" style="height: 200px">
            <h3 v-if="this.currentKeywordIndex === 0" class="title">补充转会费(万元)</h3>
            <h3 v-else-if="this.currentKeywordIndex === 1" class="title">补充工资(万元)</h3>
            <h3 v-else-if="this.currentKeywordIndex === 3" class="title">补充合同时长(年)</h3>
            <div v-if="this.currentKeywordIndex !== 2">
              <el-input v-model="inputdata"></el-input>
            </div>
            <div v-else>
              <el-select v-model="inputdata" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-card>
        </el-col>
      </el-row>


      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="saveTransfer" :disabled="save_disabled">确认</el-button>
      </div>      

    </el-dialog>
</template>


<script>
import axios from "axios";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
      inputprompt: [],
      inputdata: null,
      input_disabled: false,
      save_disabled: true,
      messages: [
        { user: 'manager', text: `我们球队有一个球员${this.value}可以考虑转会。` },
        { user: 'you', text: '我对这个球员很感兴趣，能聊聊转会费吗？' },
        // 你可以在这里添加更多的预设对话
      ],
      transferDetails: {
        fee: null,
        salary: null,
        transferWindow: '',
        contractDuration: null,
      },
      requiredKeywords: ['转会费', '工资', '转会窗口', '合同时长'],
      currentKeywordIndex: 0,
      inputcard_visible: false,

      //avatars
      randomAvatar: '',
      avatars: [
        require('@/assets/img/managerIcon/1.jpg'),
        require('@/assets/img/managerIcon/2.jpg'),
        require('@/assets/img/managerIcon/3.jpg'),
        require('@/assets/img/managerIcon/4.jpg'),
        require('@/assets/img/managerIcon/5.jpg'),
        require('@/assets/img/managerIcon/6.jpg'),
        require('@/assets/img/managerIcon/7.jpg'),
        require('@/assets/img/managerIcon/8.jpg'),
        require('@/assets/img/managerIcon/9.jpg'),
        require('@/assets/img/managerIcon/10.jpg'),
        require('@/assets/img/managerIcon/11.jpg'),
        require('@/assets/img/managerIcon/12.jpg'),
        require('@/assets/img/managerIcon/13.jpg'),
        require('@/assets/img/managerIcon/14.jpg'),
      ],

      // options
      options: [
        { value: '夏窗', label: '夏窗' },
        { value: '冬窗', label: '冬窗' }
      ],
    };
  },
  methods: {
    sendMessage() {
      if (this.input.trim()) {
        // 检测并修改 [] 中的内容
        let text = this.input;
        if (text.includes('[') && text.includes(']')) {
          const start = text.indexOf('[');
          const end = text.indexOf(']');
          const keyword = text.substring(start + 1, end);
          text = text.replace(`[${keyword}]`, this.inputdata);
        }
        // 引导输入下一个关键词
        const user = 'you';
        this.messages.push({ user, text });

        this.checkKeywordSequence(this.input);
        //reset
        this.input = '';
        this.inputdata = null;
        this.isDialogVisible = false;
        this.input_disabled = false;
      }
    },
    checkKeywordSequence(inputText) {
      const currentKeyword = this.requiredKeywords[this.currentKeywordIndex];
      
      if (inputText.includes(currentKeyword)) {
        this.handleKeywordInput(currentKeyword, inputText);
        this.currentKeywordIndex++;
        if (this.currentKeywordIndex < this.requiredKeywords.length) {
           // 提示下一个关键词
          this.messages.push({ user: 'manager', text: '好的，我明白了。' });
          this.sendPrompt(this.requiredKeywords[this.currentKeywordIndex], true);
        }
      } else {
        // 提示用户输入正确的关键词
        this.sendPrompt(currentKeyword, false);
      }

      this.inputcard_visible = false;
    },
    handleKeywordInput(keyword, inputText) {
      inputText;
      if (keyword === '转会费') {
        if (this.inputdata !== null) this.transferDetails.fee = this.inputdata;
      } else if (keyword === '工资') {
        if (this.inputdata !== null) this.transferDetails.salary = this.inputdata;
      } else if (keyword === '转会窗口') {
        if (this.inputdata.includes('冬窗')) this.transferDetails.transferWindow = '冬窗';
        else if (this.inputdata.includes('夏窗')) this.transferDetails.transferWindow = '夏窗';
      } else if (keyword === '合同时长') {
        if (this.inputdata !== null) this.transferDetails.contractDuration = this.inputdata;
      }

      // 检查是否所有信息已确认
      this.checkAllDetailsConfirmed();
    },
    extractNumber(text) {
      const matches = text.match(/\d+/);
      return matches ? parseInt(matches[0], 10) : null;
    },
    sendPrompt(keyword, status) {
      this.messages.push({ user: 'manager', text: (status ? '' : '抱歉我没有太明白你的意思，') + `请问${keyword}是多少？` });
    },
    checkAllDetailsConfirmed() {
      if (this.transferDetails.fee !== null && this.transferDetails.salary !== null &&
          this.transferDetails.transferWindow && this.transferDetails.contractDuration !== null) {
        
        ///////////////// 检测是否同时转会

        this.messages.push({ user: 'manager', text: `好的，基本情况已经确定，${this.playerName}对于加盟贵队非常感兴趣，您给出的条件看起来非常合理。我们已经与${this.playerName}和他的经纪人讨论了这份提议，他们没有异议，我们将接受这个方案` });

        // 使用 Loading 服务
        const loadingInstance = this.$loading({
          lock: true,
          text: '保存中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        setTimeout(() => {
          this.saveTransferDetails();
          loadingInstance.close(); // 关闭加载动画
        }, 1000);
      }
    },
    checkTransfer() {
      
    },
    saveTransferDetails() {
      alert('协商成功！转会数据已保存, 请点击保存按钮完成转会！');
      this.save_disabled = false;
      this.input_disabled = true;
      console.log(this.save_disabled);
    },

    //search input prompts
    querySearch(queryString, cb) {
      var inputprompt = this.inputprompt;
      var results = queryString ? inputprompt.filter(this.createFilter(queryString)) : inputprompt;

      // 添加筛选条件
      results = results.filter(prompt => this.additionalFilter(prompt));

      if (results.length > 0) {
        results = [results[0]];
      }

      cb(results);
    },
    createFilter(queryString) {
      return (prompt) => {
        return (prompt.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    additionalFilter(prompt) {
      const filterMap = {
        '转会费': 'fee',
        '工资': 'salary',
        '合同时长': 'contractDuration',
        '转会窗口': 'transferWindow'
      };

      // 检查 transferDetails 的条件
      const key = filterMap[prompt.value];
      if (key && this.transferDetails[key] !== null && this.transferDetails[key] !== '') {
        return false;
      }

      return true;
    },

    handleSelect(item) {
      this.inputcard_visible = true;
      this.input_disabled = true;
      console.log(this.currentKeywordIndex);

      const value = item.value;
      if (value === '转会费') {
        this.input = `我们愿意提供${this.transferDetails.fee === null ? '[XXX]' : this.transferDetails.fee}万元作为基础转会费，并可以考虑加入一些附加条款来满足您的要求。`
      } else if (value === '工资') {
        this.input = `我们愿意提供${this.transferDetails.salary === null ? '[XXX]' : this.transferDetails.salary}万元作为工资，我们相信这样的条件能够体现他对球队的价值，并且符合我们俱乐部的财务规划。`
        } else if (value === '转会窗口') {
          this.input = `我们倾向于在今年${this.transferDetails.transferWindow === '' ? '[XXX]' : this.transferDetails.transferWindow}的转会窗口完成这笔交易`
        } else if (value === '合同时长') {
          this.input = `我们计划提供一份合同时长为${this.transferDetails.contractDuration === null ? '[XXX]' : this.transferDetails.contractDuration}年的合同。`
        }
    },
    loadAllprompts() {
      return [
        { key: 'fee', value: '转会费' },
        { key: 'salary', value: '工资' },
        { key: 'transferWindow', value: '转会窗口' },
        { key: 'contractDuration', value: '合同时长'},
      ]
    },

    ////////////////////
    randomizeAvatar() {
      const randomIndex = Math.floor(Math.random() * this.avatars.length);
      this.randomAvatar = this.avatars[randomIndex];
    },
    scrollToBottom() {
      const chatBox = this.$refs.chatBox.$el;
      chatBox.scrollTop = chatBox.scrollHeight;
    },
    resetDialog() {
      this.input = '';
      //this.inputprompt = [];
      this.inputdata = null;
      this.input_disabled = false;
      this.messages = [
        { user: 'manager', text: `我们球队有一个球员${this.value}可以考虑转会。` },
        { user: 'you', text: '我对这个球员很感兴趣，能聊聊转会费吗？' },
        // 你可以在这里添加更多的预设对话
      ],
      this.randomizeAvatar();
      this.transferDetails = {
        fee: null,
        salary: null,
        transferWindow: '',
        contractDuration: null,
      };
      this.currentKeywordIndex = 0;
      this.inputcard_visible = false;
    },
    closeDialog() {
      axios.options(`/api/v1/agent/disconnect?userid=${this.$store.getters["user/getUserId"]}`);
      this.$emit('close');
    },
    saveTransfer() {
      this.$emit('save', this.transferDetails);
      //console.log("保存 ", this.transferDetails);
      this.closeDialog();
    },
    handleClose() {
      this.$confirm('确认退出？这将会终止这次协商。')
        .then(() => {
          // 用户点击了确认按钮
          this.$message({
            type: 'success',
            message: '退出成功'
          });
          this.closeDialog();
        })
        .catch(() => {
          // 用户点击了取消按钮
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetDialog();
      }
    },
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },
  computed: {
    isDialogVisible() {
      return this.visible;
    },
    playerName: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('update:value', newValue);
      }
    }
  },
  mounted() {
    this.inputprompt = this.loadAllprompts();
    this.randomizeAvatar();
  },
};
</script>

<style scoped>
.prompts {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.chat-content {
  max-width: 600px;
  /* margin-top: 20px; */
}
.chat-box {
  margin-bottom: 20px;
  padding: 20px;
  overflow-y: auto;
  height: 300px;
}
.input-box {
  width: 80%;
  margin-right: 10px;
}
.message {
  font-size: 18px;
}
.title {
  margin-left: 15px;
  position: absolute;
  top: 0;
  left: 10px;
}
</style>