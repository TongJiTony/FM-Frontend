<template>
    <el-dialog :visible="visible" @close="closeDialog" width="1200px">
      <el-row style="margin-left: 40px;" divider>
        <!-- 左侧：用户1信息 -->
        <el-col :span="4" class="user-info">
          <el-card>
            <el-image :src="this.randomAvatar"></el-image>
            <h4>manager</h4>
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
          <el-card class="chat-box">
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
            <h3 class="title">在这里补充[XXX]</h3>
            <el-input v-model="inputdata">
              
            </el-input>
          </el-card>
        </el-col>
      </el-row>


      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="saveTransfer">确认</el-button>
      </div>      

    </el-dialog>
</template>


<script>
//import { random } from 'core-js/core/number';

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
  data() {
    return {
      input: '',
      inputprompt: [],
      inputdata: null,
      input_disabled: false,
      messages: [
        { user: 'user1', text: '我们球队有一个球员XXX可以考虑转会。' },
        { user: 'user2', text: '我对这个球员很感兴趣，能聊聊转会费吗？' },
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
    };
  },
  methods: {
    sendMessage() {
      if (this.input.trim()) {
        // 引导输入下一个关键词
        const currentKeyword = this.requiredKeywords[this.currentKeywordIndex];
        const user = 'user2';
        const filterMap = {
        '转会费': this.transferDetails.fee,
        '工资': this.transferDetails.salary,
        '合同时长': this.transferDetails.contractDuration,
        '转会窗口': this.transferDetails.transferWindow,
        };

        this.checkKeywordSequence(this.input);

        console.log('currentKeyword:', currentKeyword);
        console.log('fee:', this.transferDetails.fee);
        console.log("current key :", filterMap);

        // 检测并修改 [] 中的内容
        let text = this.input;
        if (text.includes('[') && text.includes(']')) {
          const start = text.indexOf('[');
          const end = text.indexOf(']');
          const keyword = text.substring(start + 1, end);
          text = text.replace(`[${keyword}]`, filterMap[currentKeyword]);
        }

        this.messages.push({ user, text });

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
          this.messages.push({ user: 'user1', text: '好的，我明白了。' });
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
      // 根据关键词更新转会细节
      // if (keyword === '转会费') {
      //   const fee = this.extractNumber(inputText);
      //   if (fee !== null) this.transferDetails.fee = fee;
      // } else if (keyword === '工资') {
      //   const salary = this.extractNumber(inputText);
      //   if (salary !== null) this.transferDetails.salary = salary;
      // } else if (keyword === '转会窗口') {
      //   if (inputText.includes('冬窗')) this.transferDetails.transferWindow = '冬窗';
      //   else if (inputText.includes('夏窗')) this.transferDetails.transferWindow = '夏窗';
      // } else if (keyword === '合同时长') {
      //   const duration = this.extractNumber(inputText);
      //   if (duration !== null) this.transferDetails.contractDuration = duration;
      // }

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
      //console.log(status);

      this.messages.push({ user: 'user1', text: (status ? '' : '抱歉我没有太明白你的意思，') + `请问${keyword}是多少？` });
    },
    checkAllDetailsConfirmed() {
      if (this.transferDetails.fee !== null && this.transferDetails.salary !== null &&
          this.transferDetails.transferWindow && this.transferDetails.contractDuration !== null) {
        this.saveTransferDetails();
      }
    },
    saveTransferDetails() {
      console.log('转会细节已保存：', this.transferDetails);
      
      alert('转会已成功！');
    },

    //search input prompts
    querySearch(queryString, cb) {
      var inputprompt = this.inputprompt;
      var results = queryString ? inputprompt.filter(this.createFilter(queryString)) : inputprompt;

      // 添加筛选条件
      results = results.filter(prompt => this.additionalFilter(prompt));

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

      const value = item.value;
      if (value === '转会费') {
        this.input = `我们愿意提供${this.transferDetails.fee === null ? '[XXX]' : this.transferDetails.fee}欧元作为基础转会费，并可以考虑加入一些附加条款来满足您的要求。`
      } else if (value === '工资') {
        this.input = `我们愿意提供${this.transferDetails.salary === null ? '[XXX]' : this.transferDetails.salary}作为工资，我们相信这样的条件能够体现他对球队的价值，并且符合我们俱乐部的财务规划。`
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
      console.log(this.randomAvatar);
    },
    closeDialog() {
      this.$emit('close');
    },
    saveTransfer() {
      this.$emit('save', this.transferInfo);
      this.$emit('close');
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
  mounted() {
    this.inputprompt = this.loadAllprompts();
    console.log("this is a tsest", this.randomAvatar);
    this.randomizeAvatar();
  },
};
</script>

<style scoped>
.prompts {
  height: 280px;
  margin-top: 30%;
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