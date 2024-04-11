-cmd install ai.js const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  // If input is empty, default to "hi"
  const query = input.trim() || "hi";

  const services = [
    { url: 'https://ai-tools.replit.app/gpt', params: { prompt: query, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: query } },
    { url: 'http://fi3.bot-hosting.net:20265/api/gpt', params: { question: query } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: query } }
  ];

  let response = "Error: No response from AI services.";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'coffee',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);

    // Send response to the user
    api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      
      // Reply to the message with AI response
      message.reply(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, messageID);
    }
  }
};