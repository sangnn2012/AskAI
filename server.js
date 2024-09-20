// const envConfig = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json())

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
    const { messages } = req.body;

    try {
        if (messages == null) {
            throw new Error('We have a problem - no prompt was provided');
        }

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
        })

        const completion = response.data.choices[0].message;

        return res.status(200).json({
            success: true,
            data: completion
        })
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
