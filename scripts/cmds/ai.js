const axios = require('axios');

async function handleCommand(api, event, args, message) {
  try {
    const question = args.join(" ").trim();

    if (!question) {
      return message.reply("Please provide a question. Example: {p} cmdName {your question}");
    }

    const response = await getAnswerFromAI(question);

    if (response && response.answer) {
      message.reply(response.answer);
    } else {
      message.reply("Failed to retrieve an answer. Please try again later.");
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    message.reply("An error occurred while processing your request.");
  }
}

async function getAnswerFromAI(question) {
  try {
    const url = 'https://sandipapi.onrender.com/gpt'; // Using the first API
    const params = {
      prompt: question
    };

    const { data } = await axios.get(url, { params });

    if (data && (data.gpt4 || data.reply || data.response || data.answer || data.message)) {
      const answer = data.gpt4 || data.reply || data.response || data.answer || data.message;
      return { answer };
    } else {
      throw new Error("No valid response from AI");
    }
  } catch (error) {
    console.error("AI Error:", error.message);
    throw new Error("Failed to retrieve AI response");
  }
}

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
  const query = input.trim() || "hi";

  const services = [
    { url: 'https://sandipapi.onrender.com/gpt', params: { prompt: query } },
    { url: 'https://ai-tools.replit.app/gpt', params: { prompt: query, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: query } },
    { url: 'http://fi3.bot-hosting.net:20265/api/gpt', params: { question: query } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: query } },
    { url: 'https://personal-ai-phi.vercel.app/kshitiz', params: { prompt: query } },
    { url: 'https://lianeapi.onrender.com/@hercai/api/Herc.ai?key=j86bwkwo-8hako-12C', params: { query: query } },
    { url: 'https://ai-technology.onrender.com/api/chatgpt', params: { prompt: query } } // New AI service added
  ];

  let response = "Error: No response from AI services.";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response || data.answer || data.message)) {
      response = data.gpt4 || data.reply || data.response || data.answer || data.message;
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
    shortDescription: 'AI to answer any question',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);

    api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);

      message.reply(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, messageID);
    }
  }
};