const axios = require("axios");

module.exports = {
  config: {
    name: 'perplexity',
    version: '1.0.2',
    author: 'Shikaki & Aliester Crowley',
    countDown: 10,
    category: 'Ai',
    description: {
      en: 'perplexity ai: Can use Internet.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },

  onStart: async function ({ api, message, event, args, commandName }) {
    let prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      const clear = await axios.get(`https://pi.aliestercrowley.com/api/reset?uid=${event.senderID}`);
      message.reply(clear.data.message);
      return;
    }

    const startTime = new Date().getTime(); 

    api.setMessageReaction("⌛", event.messageID, () => { }, true);

    const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`;

    try {
      const response = await axios.get(url);
      const result = response.data.response;

      const endTime = new Date().getTime();
      const completionTime = ((endTime - startTime) / 1000).toFixed(2);

      message.reply(`✨ | 𝙿𝚎𝚛𝚙𝚕𝚎𝚡𝚒𝚝𝚢 |\n━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━`);
      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
      message.reply('✨ | 𝙿𝚎𝚛𝚙𝚕𝚎𝚡𝚒𝚝𝚢 |\n━━━━━━━━━━━━━━━━\nAn error occurred.\n━━━━━━━━━━━━━━━━', { emoji: '❌' });
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  },
};