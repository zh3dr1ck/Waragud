const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
    version: "1.0.0",
    author: "KENLIEPLAYS",
    longDescription: "AI by KENLIEPLAYS",
    category: "ai",
    guide: { en: "{prefix}gpt [ask]" },
  },
  onStart: async function ({ api, event, args }) {
    const userId = event.senderID;
    const content = encodeURIComponent(args.join(" "));

    if (!args[0]) return api.sendMessage("🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nPlease type a message...\n━━━━━━━━━━━━━━━━", event.threadID, event.messageID);

    try {
      const response = await axios.get(`https://ai-tools.replit.app/gpt?prompt=${content}&uid=${encodeURIComponent(userId)}`);
      let replyMessage = response.data.gpt4;

      if (response.data.error) {
        replyMessage = `🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nError: ${response.data.error}\n━━━━━━━━━━━━━━━━`;
      } else {
        replyMessage = `🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${replyMessage}\n━━━━━━━━━━━━━━━━`;
      }
      
      api.sendMessage(replyMessage, event.threadID, event.messageID); // Reply to the message that triggered the request
    } catch (error) {
      console.error(error);
      api.sendMessage("🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nAn error occurred while fetching the data.\n━━━━━━━━━━━━━━━━", event.threadID);
    }
  }
};