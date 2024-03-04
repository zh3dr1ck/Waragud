const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
  },
  onStart: async function ({ api, event, args }) {
    const userId = event.senderID;
    const content = encodeURIComponent(args.join(" "));
    const errorMessage = "🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nAn error occurred while fetching the data.\n━━━━━━━━━━━━━━━━";

    if (!args[0]) return api.sendMessage("🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nPlease type a message...\n━━━━━━━━━━━━━━━━", event.threadID, event.messageID);

    try {
      const [response1, response2] = await Promise.allSettled([
        axios.get(`http://fi3.bot-hosting.net:20265/api/gpt?question=${content}`),
        axios.get(`https://ai-tools.replit.app/gpt?prompt=${content}&uid=${encodeURIComponent(userId)}`)
      ]);

      let replyMessage = "Error: No response from both AI services.";

      if (response2.status === 'fulfilled' && response2.value.data.gpt4) {
        replyMessage = response2.value.data.gpt4;
      } else if (response1.status === 'fulfilled' && response1.value.data.reply) {
        replyMessage = response1.value.data.reply;
      }

      api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${replyMessage}\n━━━━━━━━━━━━━━━━`, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(errorMessage, event.threadID);
    }
  }
};