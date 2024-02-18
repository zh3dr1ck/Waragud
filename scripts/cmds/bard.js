const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cookie = 'g.a000ggihN4heMy0RFiWJ0y_IyGKKuEJcdkgC_h5Qiox4vz2jhwk2zHyryasxmE-3XTF9ORvwqwACgYKAaYSAQASFQHGX2MiKblcKVHnfMCclurGpgnALhoVAUF8yKo16KkXZfUUWKq_t8wQYsQ00076';

module.exports = {
  config: {
    name: "bard", // Changed command name to "bard"
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    longDescription: { en: "Artificial Intelligence Google Gemini" },
    guide: { en: "{pn} <query>" },
    category: "ai",
  },
  clearHistory() {
    global.GoatBot.onReply.clear();
  },

  async downloadAndSaveImage(imageUrl, imagePath) {
    try {
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      await fs.promises.writeFile(imagePath, imageResponse.data);
      return fs.createReadStream(imagePath);
    } catch (error) {
      console.error("Error occurred while downloading and saving the image:", error);
      throw new Error("An error occurred while downloading and saving the image.");
    }
  },

  async onStart({ message, event, args, commandName }) {
    const { senderID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      this.clearHistory();
      try {
        const clear = await axios.get(`https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=clear&uid=${senderID}&cookie=${cookie}`);
        message.reply(clear.data.message);
      } catch (error) {
        console.error("Error occurred while clearing history:", error);
        message.reply('An error occurred.');
      }
      return;
    }

    let apiUrl = `https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(prompt)}&uid=${senderID}&cookie=${cookie}`;

    if (event.type === "message_reply") {
      const imageUrl = event.messageReply.attachments[0]?.url;
      if (imageUrl) {
        apiUrl += `&attachment=${encodeURIComponent(imageUrl)}`;
      }
    }

    try {
      const response = await axios.get(apiUrl);
      const { message: content, imageUrls } = response.data;
      const replyOptions = { body: content };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = path.join(cacheDir, `image${i + 1}.png`);
          const imageStream = await this.downloadAndSaveImage(imageUrl, imagePath);
          imageStreams.push(imageStream);
        }

        replyOptions.attachment = imageStreams;
      }

      // Constructing the header
      let header = "🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | \n━━━━━━━━━━━━━━━━\n";
      
      // Constructing the footer
      let footer = "\n━━━━━━━━━━━━━━━━";

      // Sending the reply with header and footer
      message.reply(header + replyOptions.body + footer, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: senderID,
          });
        }
      });
    } catch (error) {
      console.error("Error occurred while processing onStart:", error);
      message.reply('An error occurred.');
    }
  },

  async onReply({ message, event, Reply, args }) {
    const prompt = args.join(" ");
    const { author, commandName, messageID } = Reply;
    if (event.senderID !== author) return;

    try {
      const apiUrl = `https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(prompt)}&uid=${author}&cookie=${cookie}`;
      const response = await axios.get(apiUrl);

      const { message: content, imageUrls } = response.data;
      const replyOptions = { body: content };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = path.join(cacheDir, `image${i + 1}.png`);
          const imageStream = await this.downloadAndSaveImage(imageUrl, imagePath);
          imageStreams.push(imageStream);
        }

        replyOptions.attachment = imageStreams;
      }

      // Constructing the header
      let header = "🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | \n━━━━━━━━━━━━━━━━\n";
      
      // Constructing the footer
      let footer = "\n━━━━━━━━━━━━━━━━";

      // Sending the reply with header and footer
      message.reply(header + replyOptions.body + footer, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author,
          });
        }
      });
    } catch (error) {
      console.error("Error occurred while processing onReply:", error);
      message.reply("An error occurred.");
    }
  },
};