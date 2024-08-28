<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="message.role">
        <p>{{ message.content }}</p>
      </div>
      <div v-if="isAssistantTyping" class="typing-indicator">对方正在输入...</div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="输入消息..."
      />
      <button :disabled="userInput.trim() === ''" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import OpenAI from "openai";

export default {
  data() {
    return {
      userInput: "",
      messages: [], 
      openai: new OpenAI({
        apiKey: process.env.VUE_APP_API_KEY,
        baseURL: "https://api.stepfun.com/v1",
        dangerouslyAllowBrowser: true,
      }),
      isAssistantTyping: false
    };
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() === "") return;

      // 用户的消息添加到对话框中
      this.messages.push({ role: "user", content: this.userInput });

      this.isAssistantTyping = true;

      const userMessage = this.userInput;
      this.userInput = ""; // 清空输入框

      let assistantMessage = ""; // 初始化空字符串以收集助手的回复

      try {
        const completion = await this.openai.chat.completions.create({
            model: "step-1-8k",
            stream: true,
            messages: [
                {
                    role: "system",
                    content: "你是由阶跃星辰提供的AI聊天助手...",
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
        });

        for await (const chunk of completion) {
          const content = chunk.choices[0].delta?.content || "";
          assistantMessage += content; // 累积内容
          this.updateAssistantMessage(assistantMessage);
        }

        this.updateAssistantMessage(assistantMessage, true);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.messages.push({ role: "assistant", content: "对不起，无法处理请求。" });
      } finally {
        this.isAssistantTyping = false;
      }
    },

    updateAssistantMessage(content, isFinal = false) {
      if (isFinal) {
        // 完成接收时，更新最后一条助手消息
        this.messages[this.messages.length - 1].content = content;
      } else {
        // 在流式接收过程中，实时更新助手消息
        const lastMessage = this.messages[this.messages.length - 1];
        if (!lastMessage || lastMessage.role !== "assistant") {
          this.messages.push({ role: "assistant", content: "" });
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

.user {
  text-align: right;
}

.assistant {
  text-align: left;
}

.typing-indicator {
  font-style: italic;
  color: #aaa;
  text-align: left;
  margin-top: 10px;
}

.input-area {
  display: flex;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
