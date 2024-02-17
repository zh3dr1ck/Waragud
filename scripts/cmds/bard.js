const axios = require('axios');

module.exports = {
  config: {
    name: "bard",
    version: "1.0",
    author: "rehat-- & Aliester Crowley",
    countDown: 10,
    role: 0,
    shortDescription: "google bard",
    category: "ai",
    guide: {
      en: "{pn} <query>"
    }
  },
  onStart: async ({ api, event, args }) => {
    try {
      const prompt = args.length > 0 ? args.join(" ") : "Hello! How can I assist you today?";
      await handleAiRequest(api, event, prompt);
    } catch (error) {
      handleError(api, event);
    }
  },
  onChat: async ({ api, event }) => {
    try {
      const { body } = event;
      if (body?.toLowerCase().startsWith("bard")) {
        const prompt = body.substring(4).trim(); // Use 4 instead of 2 to skip "bard"
        await handleAiRequest(api, event, prompt);
      }
    } catch (error) {
      handleError(api, event);
    }
  }
};

async function handleAiRequest(api, event, prompt) {
  const llm = encodeURIComponent(prompt);
  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  const res = await axios.get(`https://llama.aliestercrowley.com/api?prompt=${llm}`);
  const result = res.data.response;

  const response = `🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | 
━━━━━━━━━━━━━━━━
${result}
━━━━━━━━━━━━━━━━`;

  api.setMessageReaction("✅", event.messageID, () => {}, true);
  api.sendMessage({ body: response }, event.threadID, event.messageID);
}

function handleError(api, event) {
  console.error(error);
  api.setMessageReaction("❌", event.messageID, () => {}, true);
}