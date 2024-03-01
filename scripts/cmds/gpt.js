const axios = require('axios');

const apiKeyPart1 = "sk-XCtf9hhZD0ryrkFQ24gIT3B";
const apiKeyPart2 = "lbkFJEAuFHHK4nJTuOieE3aWs";
const apiKey = apiKeyPart1 + apiKeyPart2;

const numberGenerateImage = 4;
const maxStorageMessage = 4;

const { openAIUsing = {}, openAIHistory = {} } = global.temp;

module.exports = {
    config: {
        name: "gpt",
        version: "1.3",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Engage in conversation or create images" },
        longDescription: { en: "This AI module allows users to have engaging conversations or generate images based on provided content." },
        category: "ai",
        guide: {
            en: `
            {pn} <draw> <content> - Create an image based on the provided content.
            {pn} <clear> - Clear chat history with the AI.
            {pn} <content> - Engage in conversation with the AI.
            `
        }
    },
    langs: {
        en: {
            apiKeyEmpty: "Please provide an API key for OpenAI in the file scripts/cmds/gpt.js",
            invalidContentDraw: "Please enter the content you want to draw.",
            yourAreUsing: "You are already engaged in a conversation. Please wait for the current interaction to finish.",
            processingRequest: "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠) I'm currently working on it. Please be patient.",
            invalidContent: "Please enter the content you want to discuss.",
            error: "Oops! An error occurred:\n%1",
            clearHistory: "Your conversation history has been deleted."
        }
    },
    onStart,
    onReply
};

async function onStart({ message, event, args, getLang, prefix, commandName }) {
    if (!apiKey) {
        return message.reply(getLang('apiKeyEmpty', prefix));
    }

    switch (args[0]) {
        case 'img':
        case 'image':
        case 'draw':
            return handleImageCommand(message, event, args, getLang);
        case 'clear':
            return handleClearCommand(message, event, getLang);
        default:
            if (!args[0]) {
                return message.reply(getLang('invalidContent'));
            }
            return handleGptCommand(event, message, args, getLang, commandName);
    }
}

async function onReply({ Reply, message, event, args, getLang, commandName }) {
    if (Reply.author === event.senderID) {
        handleGptCommand(event, message, args, getLang, commandName);
    }
}

async function handleImageCommand(message, event, args, getLang) {
    if (!args[1] || openAIUsing[event.senderID]) {
        return message.reply(getLang(args[1] ? 'yourAreUsing' : 'invalidContentDraw'));
    }
    openAIUsing[event.senderID] = true;

    let sending;
    try {
        sending = await message.reply(getLang('processingRequest'));
        const responseImage = await axios({
            url: "https://api.openai.com/v1/images/generations",
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            data: { prompt: args.slice(1).join(' '), n: numberGenerateImage, size: '1024x1024' }
        });

        const images = await Promise.all(responseImage.data.data.map(async (item) => {
            const image = await axios.get(item.url, { responseType: 'stream' });
            image.data.path = `${Date.now()}.png`;
            return image.data;
        }));

        return message.reply({ attachment: images });
    } catch (err) {
        const errorMessage = err.response?.data.error.message || err.message;
        return message.reply(getLang('error', errorMessage || ''));
    } finally {
        delete openAIUsing[event.senderID];
        message.unsend((await sending).messageID);
    }
}

function handleClearCommand(message, event, getLang) {
    openAIHistory[event.senderID] = [];
    return message.reply(getLang('clearHistory'));
}

async function handleGptCommand(event, message, args, getLang, commandName) {
    try {
        openAIUsing[event.senderID] = true;

        openAIHistory[event.senderID] = (openAIHistory[event.senderID] || []).slice(-maxStorageMessage);
        openAIHistory[event.senderID].push({ role: 'user', content: args.join(' ') });

        const response = await axios({
            url: "https://api.openai.com/v1/chat/completions",
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            data: { model: "gpt-3.5-turbo", messages: openAIHistory[event.senderID], temperature: 0.7 }
        });

        const text = response.data.choices[0].message.content;
        openAIHistory[event.senderID].push({ role: 'assistant', content: text });

        const formattedText = `🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━`;
        return message.reply(formattedText, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID, messageID: info.messageID });
        });
    } catch (err) {
        const errorMessage = err.response?.data.error.message || err.message || "";
        return message.reply(getLang('error', errorMessage));
    } finally {
        delete openAIUsing[event.senderID];
    }
}