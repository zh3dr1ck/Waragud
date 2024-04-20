const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function l({ api, message, event, args }) {
  try {
    if (!args.length) {
      return message.reply("🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 |\n━━━━━━━━━━━━━━━━\nHello! How can I assist you today?\n━━━━━━━━━━━━━━━━");
    }

    const command = args[0].toLowerCase();

    if (command === "draw") {
      const prompt = args.slice(1).join(" ").trim();
      await drawImage(api, message, prompt);
    } else {
      const query = args.join(" ").trim();
      const response = await generateResponse(query);
      const formattedResponse = `🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 |\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`;
      message.reply(formattedResponse);
    }
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

async function drawImage(api, message, prompt) {
  try {
    const imageUrl = await getImageUrl(prompt);

    const imagePath = path.join(__dirname, 'cache', `image_${Date.now()}.png`);
    const writer = fs.createWriteStream(imagePath);

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        message.reply({
          body: "Generated image:",
          attachment: fs.createReadStream(imagePath)
        });
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

async function generateResponse(query) {
  try {
    const response = await axios.get(`https://gpt-four.vercel.app/gpt?prompt=${encodeURIComponent(query)}&uid=${query}`);
    return response.data.answer;
  } catch (error) {
    throw error;
  }
}

async function getImageUrl(prompt) {
  try {
    const response = await axios.get(`https://sdxl-kshitiz.onrender.com/gen?prompt=${encodeURIComponent(prompt)}&style=3`);
    return response.data.url;
  } catch (error) {
    throw error;
  }
}

const config = {
  name: "gpt",
  aliases: ["chatgpt"],
  version: "5.0",
  author: "vex_kshitiz",
  countDown: 5,
  role: 0,
  longDescription: "Chat with GPT and generate images based on prompts.",
  category: "ai",
  guide: {
    en: "{pn} {query} - for chat\n{pn} draw {prompt} - for draw"
  }
};

module.exports = {
  config,
  handleCommand: l,
  onStart: ({ api, message, event, args }) => l({ api, message, event, args }),
  onReply: ({ api, message, event, args }) => l({ api, message, event, args })
};