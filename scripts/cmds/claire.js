const axios = require('axios');
const PREFIXES = ["-claire"];
const API_ENDPOINT = 'https://lianeapi.onrender.com/ask/claire';

const askClaire = async (api, event, message) => {
    try {
        const { data } = await axios.get(`${API_ENDPOINT}?query=${encodeURIComponent(event.body.split(" ").slice(1).join(" "))}`);
        if (data?.message) {
            const messageId = await api.sendMessage(`${data.message}\n━━━━━━━━━━━━━━━`, event.threadID);
            console.log('Sent answer as a reply to the user');
        } else {
            throw new Error('Invalid or missing response from API');
        }
    } catch (err) {
        console.error(`Failed to get an answer: ${err.stack || err.message}`);
        await api.sendMessage(`Failed to get an answer. Please try again. Details: ${err.message}\n━━━━━━━━━━━━━━━`, event.threadID);
    }
};

const startsWithPrefix = (text) => PREFIXES.some(prefix => text.toLowerCase().startsWith(`${prefix} `));

const config = {
    name: 'claire',
    version: '1',
    author: 'LiANE',
    credits: 'LiANE',
    role: 0,
    usePrefix: true,
    hasPermission: 2,
    category: 'Ai',
    commandCategory: 'Ai',
    description: 'ai',
    usages: '[prompt]',
    shortDescription: { en: 'an ai you can ask for everything' },
    longDescription: { en: 'ai with a twist' },
    guide: { en: '{pn}[prompt]' }
};

const onChat = async ({ api, event, message }) => {
    if (event.body.trim() === '-claire') {
        const response = `✨ 𝗖𝗹𝗮𝗶𝗿𝗲:\n━━━━━━━━━━━━━━━\nHello! How can I assist you today? If you have any questions or need help with something, feel free to ask.\n━━━━━━━━━━━━━━━`;
        await message.reply(response);
    } else if (startsWithPrefix(event.body)) {
        await message.reply(`🕰️ | Fetching answers...`, async (err) => !err && await askClaire(api, event, message));
    }
};

module.exports = { config, onStart: async () => console.log('Bot started successfully!'), onChat, run: async () => await module.exports.onStart() };