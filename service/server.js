import express from 'express';
import cors from 'cors';
import OpenAi from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = new OpenAi({apiKey: process.env.OPENAI_API_KEY});

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);
    
    try {
        // Call OpenAI API
        const completion = await OPENAI_API_KEY.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "No additional context, just respond to the user's message."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150,
            temperature: 0.8,
        });

        console.log('OpenAI Response:', completion.choices[0].message.content);

        const botResponse = completion.choices[0].message.content;
        
        res.json({ 
            message: botResponse,
            originalMessage: message 
        });
    } catch (error) {
        console.error('OpenAI Error:', error);
        
        res.json({ 
            message: "OPENAI ERROR",
            originalMessage: message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});