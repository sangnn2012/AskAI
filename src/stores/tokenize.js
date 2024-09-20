import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTokenizeStore = defineStore('tokenize', () => {
  const tokenLength = ref(0);

  function checkToken(val) {
    fetch('http://localhost:3000/tokenize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stringToTokenize: val })
    })
      .then(response => response.json())
      .then(({tokens}) => {
        tokenLength.value = tokens;
      })
      .catch(error => console.error(error)
    )
  }

  return {
    tokenLength,
    checkToken,
  }
})
