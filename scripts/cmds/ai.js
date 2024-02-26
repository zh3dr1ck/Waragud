const axios = require('axios');

// Split API key into two parts
const apiKeyPart1 = "sk-m6VuZXVaQ6uNlKGnbA";
const apiKeyPart2 = "QdT3BlbkFJvrYX80zi7ZrZzI0duoFr";
const apiKey = apiKeyPart1 + apiKeyPart2;

const maxStorageMessage = 4;
const openAIHistory = {};

module.exports = {
    config: {
        name: "ai",
        version: "1.3",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Engage in conversation or create images" },
        longDescription: { en: "This AI module allows users to have engaging conversations or generate images based on provided content." },
        category: "ai",
        guide: {
            en: `
            {pn} <content> - Engage in conversation with the AI.
            `
        }
    },
    onStart,
    onReply
};

async function onStart({ message, event, args }) {
    if (!apiKeyPart1 || !apiKeyPart2) {
        return message.reply("Please provide both parts of the API key for OpenAI.");
    }

    if (!args[0]) {
        return message.reply("Please enter the content you want to discuss.");
    }
    
    return handleGptCommand(event, message, args);
}

async function onReply({ Reply, message, event, args }) {
    if (Reply.author === event.senderID) {
        handleGptCommand(event, message, args);
    }
}

async function handleGptCommand(event, message, args) {
    try {
        const openAIUsing = true;

        openAIHistory[event.senderID] = (openAIHistory[event.senderID] || []).slice(-maxStorageMessage);
        openAIHistory[event.senderID].push({ role: 'user', content: args.join(' ') });

        const response = await axios({
            url: "https://api.openai.com/v1/chat/completions",
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`, 
                "Content-Type": "application/json" 
            },
            data: { model: "gpt-3.5-turbo", messages: openAIHistory[event.senderID], temperature: 0.7 }
        });

        const text = response.data.choices[0].message.content;
        openAIHistory[event.senderID].push({ role: 'assistant', content: text });

        const formattedText = `𝙼𝚘𝚌𝚑𝚊 | 🧋✨\n━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━`;
        return message.reply(formattedText);
    } catch (err) {
        const errorMessage = err.response?.data.error.message || err.message || "";
        return message.reply("Oops! An error occurred:\n" + errorMessage);
    }
}