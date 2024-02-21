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
    shortDescription: { en: 'An AI you can ask for anything.' },
    longDescription: { en: 'An AI you can ask for anything.' },
    guide: { en: '{pn} [query]' },
  },

  onStart: async function ({ api, event, args = [] }) {
    try {
      const query = args.join(" ") || "hello";

      if (!query) return;

      const normalizedQuery = analyzeInput(query);

      const apiUrl = `${apiEndpointAi}&query=${encodeURIComponent(normalizedQuery)}`;
      const response = await axios.get(apiUrl);

      const correctedResponse = modernizeResponse(response.data.message);

      handleApiResponse(api, event, correctedResponse);
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
          const normalizedPrompt = analyzeInput(prompt);

          const apiUrl = `${apiEndpointAi}&query=${encodeURIComponent(normalizedPrompt)}`;
          const response = await axios.get(apiUrl);

          const correctedResponse = modernizeResponse(response.data.message);

          handleApiResponse(api, event, correctedResponse);
        } else {
          await message.reply(`${introMessage}\nHello! How can I assist you today?\n${outroMessage}`);
        }
      }
    } catch (error) {
      handleApiError(api, event, error);
    }
  }
};

function analyzeInput(input) {
  // Add your text analysis logic here
  // Example: Normalize abbreviations, slang, etc.
  return input.toLowerCase();
}

function modernizeResponse(response) {
  // Add modernization logic here
  // Example: Replace outdated terms with modern equivalents
  return response;
}

function handleApiResponse(api, event, response) {
  try {
    const trimmedMessage = response.trim();
    api.sendMessage({ body: `${introMessage}\n${trimmedMessage}\n${outroMessage}` }, event.threadID, event.messageID);
    console.log("Response sent to the user");
  } catch (error) {
    handleApiError(api, event, error);
  }
}

function handleApiError(api, event, error) {
  console.error(`❌ | There was an error getting a response: ${error.message}`);
  const errorMessage = `❌ | An error occurred: ${error.message}\n You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
  api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${errorMessage}\n${outroMessage}`, event.threadID);
}