import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useTokenizeStore } from './tokenize';

export const useTextChatStore = defineStore('textChat', () => {
  const tokenizeStore = useTokenizeStore();
  const text = ref('')
  const question = ref('')
  const prompt = ref([]);
  const gptResponse = ref('')

  function createPrompt() {
    const instructions = {
      role: 'system',
      content: 'You will answer a question about the following text.'
    }
    const textToAnalyze = { role: 'user', content: text.value }
    const chatQuestion = { role: 'user', content: question.value }

    prompt.value = [
      instructions,
      textToAnalyze,
      chatQuestion,
    ];

    tokenizeStore.checkToken(instructions.content + textToAnalyze.content + chatQuestion.content);
  }
  function sendPrompt() {
    if (text.value.length === 0) {
      alert('You have not added any text to analyse.')
    } else {
      fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: prompt.value })
      })
        .then(response => response.json())
        .then(data => {
          gptResponse.value = data.data.content;
        })
        .catch(error => console.error(error))
      }
  }
  function clearChat() {
    text.value = ''
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
  }
  return {
    text, question, prompt, gptResponse, createPrompt, sendPrompt, clearChat
  }
})
