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
  onStart: async function ({ message, event, api, args }) {
    try {
      const prompt = args.join(" ");
      await this.handleAiRequest(api, event, prompt);
    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      const { body } = event;

      if (body?.toLowerCase().startsWith("bard")) {
        const prompt = body.substring(2).trim();
        await this.handleAiRequest(api, event, prompt);
      }
    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  },
  async handleAiRequest(api, event, prompt) {
    const llm = encodeURIComponent(prompt);
    api.setMessageReaction("⌛", event.messageID, () => { }, true);

    const res = await axios.get(`https://llama.aliestercrowley.com/api?prompt=${llm}`);
    const result = res.data.response;

    // Construct the response with header and footer
    const response = `🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | 
━━━━━━━━━━━━━━━━
${result}
━━━━━━━━━━━━━━━━`;

    api.setMessageReaction("✅", event.messageID, () => { }, true);

    // Send the response back to the user
    api.sendMessage({
      body: response
    }, event.threadID, event.messageID);
  }
};