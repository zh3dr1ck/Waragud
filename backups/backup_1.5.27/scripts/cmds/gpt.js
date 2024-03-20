const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const responseHeader = "🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | ━━━━━━━━━━━━━━━━";
const responseFooter = "━━━━━━━━━━━━━━━━";

const config = {
  name: "gpt",
  aliases: ["chatgpt"],
  version: "3.0",
  author: "kshitiz",
  countDown: 5,
  role: 0,
  longDescription: "Chat with GPT-4",
  category: "ai",
  guide: {
    en: "{p}gpt {prompt}"
  }
};

async function generateText(prompt, uid) {
  try {
    const response = await axios.get(`https://ai-tools.replit.app/gpt?prompt=${encodeURIComponent(prompt)}&uid=${uid}&apikey=kshitiz`);
    return response.data.gpt4;
  } catch (error) {
    throw new Error("Failed to generate text. Please try again later.");
  }
}

async function generateImage(prompt) {
  try {
    const response = await axios.get(`https://ai-tools.replit.app/sdxl?prompt=${encodeURIComponent(prompt)}&styles=7`, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    throw new Error("Failed to generate image. Please try again later.");
  }
}

async function describeImage(prompt, photoUrl) {
  try {
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`);
    return response.data.answer;
  } catch (error) {
    throw new Error("Failed to describe image. Please try again later.");
  }
}

async function handleCommand({ api, message, event, args }) {
  try {
    const uid = event.senderID;
    const prompt = args.join(" ").trim();
    const isDrawCommand = args[0]?.toLowerCase() === "draw";

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    if (isDrawCommand) {
      const imageData = await generateImage(prompt);
      const imagePath = path.join(__dirname, 'tmp', `image_${Date.now()}.png`);
      await fs.writeFile(imagePath, imageData);
      message.reply({ body: responseHeader, attachment: fs.createReadStream(imagePath), footer: responseFooter });
    } else {
      const text = await generateText(prompt, uid);
      message.reply(`${responseHeader}\n${text}\n${responseFooter}`, (reply, threadID) => {
        global.GoatBot.onReply.set(threadID, { commandName: config.name, uid });
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

module.exports = {
  config,
  handleCommand,
  onStart: ({ api, message, event, args }) => handleCommand({ api, message, event, args }),
  onReply: ({ api, message, event, args }) => handleCommand({ api, message, event, args })
};