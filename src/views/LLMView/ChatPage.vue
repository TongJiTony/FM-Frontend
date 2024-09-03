<template>
  <div class="chat-container">
    <div class="messages">
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
// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/chatAPI/v1', // The proxy path
// //   headers: {
// //     'Authorization': `Bearer ${process.env.VUE_APP_API_KEY}`,
// //     'Content-Type': 'application/json',
// //   },
// });

import OpenAI from "openai";
const openai = new OpenAI({apiKey:process.env.VUE_APP_API_KEY, baseURL:'/chatAPI/v1',dangerouslyAllowBrowser: true });

export default {
  data() {
    return {
      userInput: '你好',
      messages: [],
      isAssistantTyping: false,
    };
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() === '') return;

      // Add user message to chat
      this.messages.push({ role: 'user', content: this.userInput });

      this.isAssistantTyping = true;

      const userMessage = this.userInput;
      this.userInput = ''; // Clear input field

      try {
        const response = await openai.chat.completions.create({
          stream: true,
          model: 'step-1-8k',
          messages: [
            {
              role: 'system',
              content: '你是Football-Manager的智能助手，负责为球队经理提供球队信息汇总和球队发展建议，请你用中文回答，目前队伍为国际米兰，队伍人数为12人',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        });

        let assistantMessage = ''; // Initialize empty string to collect assistant's response

        // Handle the streamed response
        response.data.on('data', chunk => {
          const content = chunk.toString(); // Convert chunk to string
          assistantMessage += content; // Accumulate content

          // Update assistant message in real-time
          this.updateAssistantMessage(assistantMessage);
        });

        response.data.on('end', () => {
          this.updateAssistantMessage(assistantMessage, true);
          this.isAssistantTyping = false; // Set typing status to false when done
        });

      } catch (error) {
        console.error('Error fetching AI response:', error);
        this.isAssistantTyping = false; // Set typing status to false on error
      }
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
