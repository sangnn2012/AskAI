const envConfig = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const OpenAI = require('openai');
const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json())

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
    console.log('Received request to /chat');
    console.log('Request body:', req.body);
    
    const { messages } = req.body;
  
    try {
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error('Invalid or empty messages array provided');
      }
  
      console.log('Sending request to OpenAI');
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      })
  
      console.log('Received response from OpenAI');
      const completion = response.choices[0].message;
  
      console.log('Sending response back to client');
      return res.status(200).json({
        success: true,
        data: completion
      })
    } catch (error) {
      console.error('Error in /chat endpoint:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  });

const { encode } = require('gpt-3-encoder');

app.post('/tokenize', async (req, res) => {
    const { stringToTokenize: str } = req.body;

    try {
        if (str == null) {
            throw new Error('No string was provided');
        }

        const encoded = encode(str);
        const length = encoded.length;

        return res.status(200).json({
            success: true,
            tokens: length
        })
    } catch (error) {
        console.log(error.message);
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
