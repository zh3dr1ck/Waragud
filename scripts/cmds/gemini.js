const axios = require("axios");
const tinyurl = require("tinyurl");

const API_BASE_URL = "https://api-samir.onrender.com";
const HEADER = "👩‍💻 | 𝙶𝚎𝚖𝚒𝚗𝚒 | \n━━━━━━━━━━━━━━━━";
const FOOTER = "━━━━━━━━━━━━━━━━";

async function makeRequest(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function shortenUrl(url) {
  return await tinyurl.shorten(url);
}

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "Samir OE",
    shortDescription: "Google Gemini",
    countDown: 5,
    role: 0,
    category: "ai",
  },

  async onStart({ message, event, args }) {
    try {
      // Check if the command is specifically '-gemini' without any additional arguments
      if (args.length === 0 || (args.length === 1 && args[0] === '-gemini')) {
        const answer = `${HEADER}\nHello there! How can I assist you today?\n${FOOTER}`;
        message.reply({ body: answer });
        return;
      }

      let shortLink;

      if (event.type === "message_reply" && ["photo", "sticker"].includes(event.messageReply?.attachments?.[0]?.type)) {
        shortLink = await shortenUrl(event.messageReply.attachments[0].url);
      } else {
        const text = encodeURIComponent(args.join(' '));
        const response = await makeRequest(`${API_BASE_URL}/Gemini?text=${text}`);

        if (response?.candidates?.length > 0) {
          const answer = `${HEADER}\n${response.candidates[0].content.parts[0].text}\n${FOOTER}`;
          message.reply({ body: answer });
          return;
        }
      }

      if (!shortLink) throw new Error("Invalid message or attachment type");

      const likeResponse = await makeRequest(`${API_BASE_URL}/telegraph?url=${encodeURIComponent(shortLink)}&senderId=Y=777565`);
      const visionResponse = await makeRequest(`${API_BASE_URL}/gemini-pro?text=${encodeURIComponent(args.join(' '))}&url=${encodeURIComponent(likeResponse.result.link)}`);
      const answer = `${HEADER}\n${visionResponse}\n${FOOTER}`;
      message.reply({ body: answer });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  async onReply({ message, event, Reply, args }) {
    try {
      const { author, commandName } = Reply;
      if (event.senderID !== author) return;

      const response = await makeRequest(`${API_BASE_URL}/Gemini?text=${encodeURIComponent(args.join(' '))}`);

      if (response?.candidates?.length > 0) {
        const answer = `${HEADER}\n${response.candidates[0].content.parts[0].text}\n${FOOTER}`;
        message.reply({ body: answer });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};