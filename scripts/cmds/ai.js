const axios = require('axios');

const apiEndpointAi = 'https://lianeapi.onrender.com/@hercai/api/Herc.ai?key=j86bwkwo-8hako-12C';

const introMessage = "🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━";
const outroMessage = "━━━━━━━━━━━━━━━━";

module.exports = {
  config: {
    name: 'ai',
    version: '1.0',
    author: 'Coffee',
    role: 0,
    category: 'ai',
    shortDescription: { en: 'an ai you can ask for anything.' },
    longDescription: { en: 'an ai you can ask for anything.' },
    guide: { en: '{pn} [query]' },
  },

  onStart: async function ({ api, event, args = [] }) {
    try {
      const query = args.join(" ") || "hello";

      if (!query) return;

      const apiUrl = `${apiEndpointAi}&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      handleApiResponse(api, event, response);
    } catch (error) {
      handleApiError(api, event, error);
    }
  },

  onChat: async function ({ api, event, args, message }) {
    try {
      const { body } = event;

      if (body?.toLowerCase().startsWith("ai")) {
        const prompt = body.substring(2).trim();

        if (prompt) {
          const apiUrl = `${apiEndpointAi}&query=${encodeURIComponent(prompt)}`;
          const response = await axios.get(apiUrl);

          handleApiResponse(api, event, response);
        } else {
          await message.reply(`${introMessage}\nHello! How can I assist you today?\n${outroMessage}`);
        }
      }
    } catch (error) {
      handleApiError(api, event, error);
    }
  }
};

function handleApiResponse(api, event, response) {
  try {
    const { data } = response;

    if (data?.message) {
      const trimmedMessage = data.message.trim();
      api.sendMessage({ body: `${introMessage}\n${trimmedMessage}\n${outroMessage}` }, event.threadID, event.messageID);
      console.log("Response sent to the user");
    } else {
      throw new Error("Invalid or missing response from the API");
    }
  } catch (error) {
    handleApiError(api, event, error);
  }
}

function handleApiError(api, event, error) {
  console.error(`❌ | There was an error getting a response: ${error.message}`);
  const errorMessage = `❌ | An error occurred: ${error.message}\n You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
  api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${errorMessage}\n${outroMessage}`, event.threadID);
}