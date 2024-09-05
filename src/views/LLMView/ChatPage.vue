<template>
  <div class="chat-container">
    <div v-loading="isLoading" 
         element-loading-text="智能助手初始化中..."
         class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="bubble">
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const api = axios.create({
  baseURL: '/chatAPI/v1', // The proxy path
  headers: {
    'Authorization': `Bearer ${process.env.VUE_APP_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
export default {
  data() {
    return {
      userInput: '你好',
      messages: [],
      isAssistantTyping: false,
      team_id: this.$store.getters["user/getTeamID"], //get team_id from vuex
      isLoading: true, // 是否正在加载数据
      contractData: null,
      lineupData: null,
      playerData: null,
      recordData: null,
      teamData: null,
      trainingData: null,
      transferData: null,
    };
  },
  mounted() {
    // 页面加载时调用 getInfo
    this.getInfo();
  },
  methods: {
     async getInfo() {
      this.isLoading = true; // 开始加载，显示loading状态

      try {
        const contractRequest = axios.get(`/api/v1/contract/displayall?teamid=${this.team_id}`);
        const lineupRequest = axios.get(`/api/v1/lineup/displayall?teamid=${this.team_id}`);
        const playerRequest = axios.get(`/api/v1/player/displayall?teamid=${this.team_id}`);
        const recordRequest = axios.get(`/api/v1/record/search?team_id=${this.team_id}`);
        const teamRequest = axios.get(`/api/v1/team/displayone?Teamid=${this.team_id}`);
        const trainingRequest = axios.get(`/api/v1/training/displayall?teamid=${this.team_id}`);
        const transferRequest = axios.get(`/api/v1/transfer/displayall?teamid=${this.team_id}`);

        // 并行请求所有数据
        const [contractData, lineupData, playerData, recordData, teamData, trainingData,transferData] = await Promise.all([
          contractRequest,
          lineupRequest,
          playerRequest,
          recordRequest,
          teamRequest,
          trainingRequest,
          transferRequest,
        ]);


        console.log("Contract Data:", contractData.data);
        console.log("Lineup Data:", lineupData.data);
        console.log("Player Data:", playerData.data);
        console.log("Record Data:", recordData.data);
        console.log("Team Data:", teamData.data);
        console.log("Training Data:", trainingData.data);
        console.log("Transfer Data:", transferData.data);
         // 保存数据到状态
        this.contractData = contractData.data;
        this.lineupData = lineupData.data;
        this.playerData = playerData.data;
        this.recordData = recordData.data;
        this.teamData = teamData.data;
        this.trainingData = trainingData.data;
        this.transferData = transferData.data;
        

      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        this.isLoading = false; // 请求完成，隐藏loading状态
      }
    },

    async sendMessage() {
      if (this.userInput.trim() === '') return;
      // Add user message to chat
      this.messages.push({ role: 'user', content: this.userInput });
      this.isAssistantTyping = true;
      const userMessage = this.userInput;
      this.userInput = ''; // Clear input field
      try {
        const systemMessage = `你是Football-Manager的智能助手，负责为球队经理提供球队信息汇总和球队发展建议。
          队伍信息数据: ${JSON.stringify(this.teamData)}。
          队伍当前合同数据: ${JSON.stringify(this.contractData)},
          队伍阵容数据: ${JSON.stringify(this.lineupData)}, 
          队伍所有球员数据: ${JSON.stringify(this.playerData)}, 
          财务记录数据: ${JSON.stringify(this.recordData)}。
          队伍训练数据: ${JSON.stringify(this.trainingData)}。
          队伍转会数据(FROM意味着队员离开到另外的队伍，TO意味着队员来带本队伍，在说明球员总数的时候可以附加说明转会球员是谁): ${JSON.stringify(this.transferData)}。
          请你用中文回答，一次回答尽量不要超过100个字`;
        const response = await api.post("/chat/completions", {
          model: "step-1-8k",
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        });
        // Simulate streaming effect by updating message content in chunks
        const assistantMessage = response.data.choices[0].message.content;
        this.simulateStreamingEffect(assistantMessage);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        this.isAssistantTyping = false; // Set typing status to false on error
      }
    },
    simulateStreamingEffect(content) {
      const chunks = content.split(''); // Split content into chunks for simulation
      let currentChunk = '';
      this.updateAssistantMessage('', false); // Initialize empty assistant message
      const interval = setInterval(() => {
        if (chunks.length === 0) {
          clearInterval(interval);
          this.updateAssistantMessage(currentChunk, true); // Finalize message
          this.isAssistantTyping = false; // Set typing status to false
          return;
        }
        currentChunk += chunks.shift();
        this.updateAssistantMessage(currentChunk, false); // Update with current chunk
      }, 50); // Adjust the interval as needed for the desired typing effect
    },
    updateAssistantMessage(content, isFinal = false) {
      if (isFinal) {
        this.messages[this.messages.length - 1].content = content;
      } else {
        if (this.messages[this.messages.length - 1]?.role !== 'assistant') {
          this.messages.push({ role: 'assistant', content: '' });
        }
        this.messages[this.messages.length - 1].content = content;
      }
    }
  }
};
</script>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ccc;
  padding: 10px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}
.message {
  display: flex;
  margin-bottom: 10px;
}
.message.user {
  justify-content: flex-end;
}
.message.assistant {
  justify-content: flex-start;
}
.bubble {
  max-width: 70%;
  padding: 10px;
  border-radius: 15px;
  background-color: #f1f1f1;
  position: relative;
}
.message.user .bubble {
  background-color: #007bff;
  color: white;
}
.message.assistant .bubble {
  background-color: #e5e5e5;
}
.input-area {
  display: flex;
  margin-top: 10px;
}
input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>



