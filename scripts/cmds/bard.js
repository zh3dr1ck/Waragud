const axios = require("axios");
const fs = require("fs").promises; // Using promises for filesystem operations
const { dirname } = require("path");

const cookie = 'g.a000gAihNz91_wNlQPMt2VzDT9s3eGSUXM6uHZ92wht4f9GTtoU14itE6Fh4b1dISUgcj8TJNgACgYKAYISAQASFQHGX2Mi1HzcU4yG_zU8akdw8NcMnhoVAUF8yKrtcMUeHC0B26sPj-BrxPiZ0076';

module.exports = {
  config: {
    name: "bard",
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Google Bard, now Gemini" },
    longDescription: { en: "Google Bard, now Gemini" },
    guide: { en: "{pn} <query>" },
    category: "ai",
  },
  clearHistory: function () {
    global.GoatBot.onReply.clear();
  },

  onStart: async function ({ message, event, args, commandName }) {
    const uid = event.senderID;
    const prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      this.clearHistory();
      try {
        const clear = await axios.get(`https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=clear&uid=${uid}&cookie=${cookie}`);
        message.reply(clear.data.message);
      } catch (error) {
        console.error("Error occurred while clearing history:", error);
        message.reply('An error occurred.');
      }
      return;
    }

    let apiUrl = `https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(prompt)}&uid=${uid}&cookie=${cookie}`;

    if (event.type === "message_reply") {
      const imageUrl = event.messageReply.attachments?.[0]?.url;
      if (imageUrl) {
        apiUrl += `&attachment=${encodeURIComponent(imageUrl)}`;
      }
    }

    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      let content = result.message;
      let imageUrls = result.imageUrls;

      let replyOptions = {
        body: `🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | \n━━━━━━━━━━━━━━━━\n${content}`,
      };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        const cacheDir = `${__dirname}/cache`;
        await fs.mkdir(cacheDir, { recursive: true }); // Using recursive option to create nested directories if they don't exist

        await Promise.all(imageUrls.map(async (imageUrl, index) => {
          const imagePath = `${cacheDir}/image${index + 1}.png`;

          try {
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            await fs.writeFile(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }));

        replyOptions.attachment = imageStreams;
      }

      // Add footer to the reply
      replyOptions.body += '\n━━━━━━━━━━━━━━━━';

      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      console.error("Error occurred while processing the request:", error);
      message.reply('An error occurred.');
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    const prompt = args.join(" ");
    let { author, commandName, messageID } = Reply;
    if (event.senderID !== author) return;

    try {
      const apiUrl = `https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(prompt)}&uid=${author}&cookie=${cookie}`;
      const response = await axios.get(apiUrl);

      let content = response.data.message;
      let replyOptions = {
        body: `🗨 | 𝙶𝚘𝚘𝚐𝚕𝚎 𝙱𝚊𝚛𝚍 | \n━━━━━━━━━━━━━━━━\n${content}`,
      };

      const imageUrls = response.data.imageUrls;
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        const cacheDir = `${__dirname}/cache`;
        await fs.mkdir(cacheDir, { recursive: true });

        await Promise.all(imageUrls.map(async (imageUrl, index) => {
          const imagePath = `${cacheDir}/image${index + 1}.png`;

          try {
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            await fs.writeFile(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }));

        replyOptions.attachment = imageStreams;
      }

      // Add footer to the reply
      replyOptions.body += '\n━━━━━━━━━━━━━━━━';

      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      console.error("Error occurred while processing the request:", error);
      message.reply("An error occurred.");
    }
  },
};