<template>
  <div class="chat-container">
    <div
      v-loading="isLoading"
      element-loading-text="智能助手初始化中..."
      class="messages"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="icon">
          <i
            :class="
              message.role === 'user' ? 'el-icon-user' : 'el-icon-s-check'
            "
            class="icon-size"
          ></i>
        </div>
        <div class="bubble">
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendData"
        type="text"
        placeholder="输入消息..."
      />
      <button @click="sendData">发送</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui"; // 用于提示信息

const api = axios.create({
  baseURL: "", // The proxy path
  headers: {
    Authorization: `Bearer ${process.env.VUE_APP_API_KEY}`,
    "Content-Type": "application/json",
  },
});
export default {
  data() {
    return {
      userInput: "你好",
      messages: [],
      isAssistantTyping: false,
      team_id: this.$store.getters["user/getTeamID"], //get team_id from vuex
      isLoading: true, // 是否正在加载数据
      maxTokens: 7992, // LLM的单次最大token数 8192 - 200 = 7992(200为允许用户的自由输入)
      minSendInterval: 3000, // 限制最小发送间隔，3秒
      lastSendTime: 0, // 记录上次发送时间
      priorityData: [
        // 数据请求优先级
        { key: "playerData", data: null, priority: 4 }, //0
        { key: "trainingData", data: null, priority: 3 }, //1
        { key: "lineupData", data: null, priority: 8 }, //2
        { key: "contractData", data: null, priority: 2 }, //3
        { key: "transferData", data: null, priority: 5 }, //4
        { key: "recordData", data: null, priority: 9 }, //5
        { key: "homeMatchData", data: null, priority: 6 }, //6
        { key: "awayMatchData", data: null, priority: 7 }, //7
        { key: "medicalData", data: null, priority: 8 }, //8
      ],
    };
  },
  mounted() {
    // 页面加载时调用 initialize()
    this.initialize();
  },
  methods: {
    // 初始化入口函数
    async initialize() {
      this.isLoading = true; // 开始加载，显示loading状态
      try {
        const allData = await this.getInfo(); // 获取所有可选的数据
        const truncatedData = await this.optimizeData(allData); // 优化并截断数据
        const success = await this.sendData(truncatedData); // 发送优化后的数据
        if (success) {
          this.isLoading = false; // 数据传输成功，停止loading
        } else {
          this.showError("数据传输失败，请稍后再试。");
        }
      } catch (error) {
        console.error("初始化失败", error);
        this.showError("初始化失败，请稍后再试。");
      }
    },
    async sendData(truncatedData) {
      // 检查发送时间间隔
      const currentTime = Date.now();
      if (currentTime - this.lastSendTime < this.minSendInterval) {
        this.showError("请求发送太频繁，请稍后再试。");
        return false;
      }
      this.lastSendTime = currentTime; // 更新发送时间

      // 检查用户输入是否为空
      if (this.userInput.trim() === "") return false;



      const allData = await this.getInfo();
      truncatedData = await this.optimizeData(allData);// 优化并截断数据，在这里要更新第二次，否则会出现第二次发送的数据有问题
      // 发送数据逻辑
      const lineupDataMessage =
        truncatedData.lineupData && truncatedData.lineupData.length > 0
          ? JSON.stringify(truncatedData.lineupData)
          : "暂无阵容数据";
      const contractDataMessage =
        truncatedData.contractData && truncatedData.contractData.length > 0
          ? JSON.stringify(truncatedData.contractData)
          : "暂无合同数据";
      const playerDataMessage =
        truncatedData.playerData && truncatedData.playerData.length > 0
          ? JSON.stringify(truncatedData.playerData)
          : "暂无球员数据";
      const recordDataMessage =
        truncatedData.recordData && truncatedData.recordData.length > 0
          ? JSON.stringify(truncatedData.recordData)
          : "暂无记录数据";
      const trainingDataMessage =
        truncatedData.trainingData && truncatedData.trainingData.length > 0
          ? JSON.stringify(truncatedData.trainingData)
          : "暂无训练数据";
      const transferDataMessage =
        truncatedData.transferData && truncatedData.transferData.length > 0
          ? JSON.stringify(truncatedData.transferData)
          : "暂无转会数据";
      const homeMatchDataMessage =
        truncatedData.homeMatchData && truncatedData.homeMatchData.length > 0
          ? JSON.stringify(truncatedData.homeMatchData)
          : "暂无主场比赛数据";
      const awayMatchDataMessage =
        truncatedData.awayMatchData && truncatedData.awayMatchData.length > 0
          ? JSON.stringify(truncatedData.awayMatchData)
          : "暂无客场比赛数据";
      const medicalDataMessage =
        truncatedData.medicalData && truncatedData.medicalData.length > 0
          ? JSON.stringify(truncatedData.medicalData)
          : "暂无医疗数据";
      

      // Add user message to chat
      this.messages.push({ role: "user", content: this.userInput });
      this.isAssistantTyping = true;
      const userMessage = this.userInput;
      this.userInput = ""; // Clear input field
      const systemMessage = `你是Football-Manager的智能助手，负责为球队经理提供球队信息汇总和球队发展建议，请你用中文回答，一次回答尽量不要超过100个字。 
          球员信息: ${playerDataMessage}, 
          训练情况: ${trainingDataMessage},
          阵容情况: ${lineupDataMessage}, 
          合同信息: ${contractDataMessage},
          财务数据: ${recordDataMessage},
          转会数据: ${transferDataMessage},
          主场比赛数据: ${homeMatchDataMessage},
          客场比赛数据: ${awayMatchDataMessage},
          医疗数据: ${medicalDataMessage}。         
          `;
      const allmessages = systemMessage + userMessage; //合并用户消息和系统消息
      const alltokens = await this.calculateTokenCount(allmessages);
      if (alltokens > this.maxTokens + 200) {
        this.messages.error("用户输入的数据过长，本次不会回答任何内容，请减少输入内容。");
        return false;
      }
      console.log("本次发送数据:", truncatedData);

      try {
        const response = await api.post("/LLM/v1/chat/completions", {
          model: "step-1-8k",
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        });

        // Simulate streaming effect by updating message content in chunks
        const assistantMessage = response.data.choices[0].message.content;
        this.simulateStreamingEffect(assistantMessage);
        return true;
      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.handleError(error); // 处理不同错误码
        this.isAssistantTyping = false; // Set typing status to false on error
        return false;
      } 
    },

    async calculateTokenCount(messages) {
      try {
        const response = await api.post(
          "/LLM/v1/token/count",
          {
            model: "step-1-8k",
            messages: [
              {
                role: "user",
                content: messages,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.VUE_APP_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data.data.total_tokens; // 返回总的tokens数量
      } catch (error) {
        console.error("Error calculating tokens:", error);
        return null;
      }
    },

    async getInfo() {
      try {
        const contractRequest = axios.get(
          `/api/v1/contract/displayall?teamid=${this.team_id}`
        );
        const lineupRequest = axios.get(
          `/api/v1/lineup/displayall?teamid=${this.team_id}`
        );
        const playerRequest = axios.get(
          `/api/v1/player/displayall?teamid=${this.team_id}`
        );
        const recordRequest = axios.get(
          `/api/v1/record/search?team_id=${this.team_id}`
        );
        const trainingRequest = axios.get(
          `/api/v1/training/displayall?teamid=${this.team_id}`
        );
        const transferRequest = axios.get(
          `/api/v1/transfer/displayall?teamid=${this.team_id}`
        );
        const homeMatchRequest = axios.get(
          `/api/v1/match/search?home_team_id=${this.team_id}`
        );
        const awayMatchRequest = axios.get(
          `/api/v1/match/search?away_team_id=${this.team_id}`
        );
        const medicalRequest = axios.get(
          `/api/v1/medical/displayall?teamid=${this.team_id}`
        );

        // 并行请求所有数据
        const [
          contractData,
          lineupData,
          playerData,
          recordData,
          trainingData,
          transferData,
          homeMatchData,
          awayMatchData,
          medicalData,
        ] = await Promise.all([
          contractRequest,
          lineupRequest,
          playerRequest,
          recordRequest,
          trainingRequest,
          transferRequest,
          homeMatchRequest,
          awayMatchRequest,
          medicalRequest,
        ]);

        // 将数据存储到对应的变量中
        this.priorityData.forEach((item) => {
          switch (item.key) {
            case "contractData":
              item.data = contractData.data;
              break;
            case "lineupData":
              item.data = lineupData.data;
              break;
            case "playerData":
              item.data = playerData.data;
              break;
            case "recordData":
              item.data = recordData.data;
              break;
            case "trainingData":
              item.data = trainingData.data;
              break;
            case "transferData":
              item.data = transferData.data;
              break;
            case "homeMatchData":
              item.data = homeMatchData.data;
              break;
            case "awayMatchData":
              item.data = awayMatchData.data;
              break;
            case "medicalData":
              item.data = medicalData.data;
              break;
          }
        });
        // 返回一个包含所有数据的对象
        return {
          contractData: contractData.data,
          lineupData: lineupData.data,
          playerData: playerData.data,
          recordData: recordData.data,
          trainingData: trainingData.data,
          transferData: transferData.data,
          homeMatchData: homeMatchData.data,
          awayMatchData: awayMatchData.data,
          medicalData: medicalData.data,
        };
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        this.isLoading = false; // 请求完成，隐藏loading状态
      }
    },

    // 优化数据并截断
    async optimizeData(data) {
      const priorityList = await Promise.all(
        // 并行计算tokens
        this.priorityData.map(async (item) => {
          const tokens = await this.calculateTokenCount(
            JSON.stringify(data[item.key])
          ); // 计算tokens
          console.log(`${item.key} `, data[item.key]);
          console.log(`${item.key} tokens`, tokens);
          return {
            key: item.key,
            data: data[item.key],
            tokens: tokens, // 直接使用 tokens
            priority: item.priority,
          };
        })
      );

      // 计算总的tokens数量
      let totalTokens = priorityList.reduce(
        (sum, item) => sum + item.tokens,
        0
      );
      console.info("origin-totalTokens:", totalTokens);

      // 优先根据tokens大小从高到低排序，并按照优先级逐步删除
      priorityList.sort((a, b) => a.priority - b.priority); // 优先级从小到大排序

      // 移除优先级较低的数据直到满足最大tokens要求
      while (totalTokens > this.maxTokens && priorityList.length > 0) {
        const removedItem = priorityList.pop();
        console.warn(`移除优先级较低的数据: ${removedItem.key}`);
        totalTokens -= removedItem.tokens;
        console.info("current-totalTokens:", totalTokens);
      }

      // 返回优化后的数据
      return priorityList.reduce((result, item) => {
        result[item.key] = item.data;
        return result;
      }, {});
    },

    simulateStreamingEffect(content) {
      const chunks = content.split(""); // Split content into chunks for simulation
      let currentChunk = "";
      this.updateAssistantMessage("", false); // Initialize empty assistant message
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
        if (this.messages[this.messages.length - 1]?.role !== "assistant") {
          this.messages.push({ role: "assistant", content: "" });
        }
        this.messages[this.messages.length - 1].content = content;
      }
    },

    // 处理错误并给出提示
    handleError(error) {
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            this.showError("请求无效，请检查输入的数据。");
            break;
          case 404:
            this.showError("未找到相关数据，请稍后再试。");
            break;
          case 500:
            this.showError("服务器内部错误，请稍后再试。");
            break;
          case 429:
            this.showError("请求过多，请稍后再试。");
            break;
          default:
            this.showError("未知错误，请稍后再试。");
        }
      } else {
        this.showError("无法连接到服务器，请检查网络。");
      }
    },

    // 提示错误信息
    showError(message) {
      Message.error({
        message: message,
        duration: 5000,
      });
    },
  },
};
</script>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 700px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
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
  flex-direction: row-reverse; /* 用户消息靠右 */
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

.icon {
  margin-right: 10px; /* 用户的图标右边距 */
  margin-left: 10px; /* 助手的图标左边距 */
}

.icon-size {
  font-size: 24px; /* 图标大小 */
}
</style>
