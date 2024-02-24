const axios = require("axios");

module.exports = {
  config: {
    name: 'perplexity',
    version: '1.0.2',
    author: 'Shikaki & Aliester Crowley',
    countDown: 10,
    role: 0,
    category: 'Ai',
    shortDescription: {
      en: 'Perplexity AI: Fine-tuned for Google search.',
    },
    longDescription: {
      en: 'Perplexity AI: An AI that gracefully searches and gives better output than Google search and gives more real-time and accurate info than Gemini.',
    },
    guide: {
      en: '{pn} [prompt]\n\n{pn} clear -> Reset chat if you get gibberish replies.',
    },
  },

  onStart: async function ({ api, message, event, args }) {
    let prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      const clear = await axios.get(`https://perplexity.aliestercrowley.com/api/reset?username=${event.senderID}`);
      message.reply(clear.data.message);
      return;
    }

    api.setMessageReaction("🕰️", event.messageID, () => { }, true);

    const url = `https://perplexity.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&username=${event.senderID}`;

    try {
      const response = await axios.get(url);
      const result = response.data.response;

      // Automatically correct grammar of the AI's response for better fluency
      const correctedResponse = autoCorrectGrammar(result);

      // Add header and footer to the response
      const finalResponse = `✨ | 𝙿𝚎𝚛𝚙𝚕𝚎𝚡𝚒𝚝𝚢 |\n━━━━━━━━━━━━━━━━\n${correctedResponse}\n━━━━━━━━━━━━━━━━`;

      message.reply(finalResponse);

      api.setMessageReaction("✨", event.messageID, () => { }, true);
    } catch (error) {
      message.reply('An error occurred.');
      api.setMessageReaction("🤷", event.messageID, () => { }, true);
    }
  },

  onReply: async function ({ api, message, event, Reply, args }) {
    const prompt = args.join(" ");
    let { author } = Reply;
    if (event.senderID !== author) return;

    if (prompt.toLowerCase() === "clear") {
      const clear = await axios.get(`https://perplexity.aliestercrowley.com/api/reset?username=${event.senderID}`);
      message.reply(clear.data.message);
      return;
    }

    api.setMessageReaction("🕰️", event.messageID, () => { }, true);

    const url = `https://perplexity.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&username=${event.senderID}`;
    try {
      const response = await axios.get(url);

      const content = response.data.response;

      // Automatically correct grammar of the AI's response for better fluency
      const correctedResponse = autoCorrectGrammar(content);

      // Add header and footer to the response
      const finalResponse = `✨ | 𝙿𝚎𝚛𝚙𝚕𝚎𝚡𝚒𝚝𝚢 |\n━━━━━━━━━━━━━━━━\n${correctedResponse}\n━━━━━━━━━━━━━━━━`;

      message.reply(finalResponse);

      api.setMessageReaction("✨", event.messageID, () => { }, true);
    } catch (error) {
      console.error(error.message);
      message.reply("An error occurred.");
      api.setMessageReaction("🤦", event.messageID, () => { }, true);
    }
  },
};

// Function to automatically correct the grammar of the AI's response
function autoCorrectGrammar(response) {
  // Implement basic automatic grammar correction here
  // For example, you can capitalize the first letter of sentences and "i", fix punctuation, etc.
  let correctedResponse = response;

  // Capitalize the first letter of sentences
  correctedResponse = correctedResponse.replace(/(?:^|\.\s+)([a-z])/g, (match) => match.toUpperCase());

  // Capitalize "i"
  correctedResponse = correctedResponse.replace(/\bi\b/g, "I");

  return correctedResponse;
}