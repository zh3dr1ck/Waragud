const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function lado(api, event, args, message) {
  try {
    message.reply("🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nSorry, but this functionality has been disabled.\n━━━━━━━━━━━━━━━━");
  } catch (error) {
    handleErrorMessage(error, message);
  }
}

async function kshitiz(api, event, args, message) {
  try {
    message.reply("🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nSorry, but this functionality has been disabled.\n━━━━━━━━━━━━━━━━");
  } catch (error) {
    handleErrorMessage(error, message);
  }
}

const config = {
  name: "gpt",
  aliases: ["chatgpt"],
  version: "3.0",
  author: "vex_kshitiz",
  countDown: 5,
  role: 0,
  longDescription: "Chat with GPT-4",
  category: "ai",
  guide: {
    en: "{p}gpt {prompt}"
  }
};

async function getGPTResponse(prompt, uid) {
  try {
    const response = await axios.get(`https://ai-tools.replit.app/gpt?prompt=${encodeURIComponent(prompt)}&uid=${uid}&apikey=kshitiz`);
    return response.data.gpt4;
  } catch (error) {
    throw new Error("Failed to fetch GPT response");
  }
}

async function getImage(prompt) {
  try {
    const response = await axios.get(`https://ai-tools.replit.app/sdxl?prompt=${encodeURIComponent(prompt)}&styles=7`, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch image");
  }
}

async function describeImage(prompt, photoUrl) {
  try {
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`);
    return response.data.answer;
  } catch (error) {
    throw new Error("Failed to describe image");
  }
}

async function handleCommand({ api, message, event, args }) {
  try {
    const { senderID } = event;
    const [command, ...commandArgs] = args.map(arg => arg.toLowerCase().trim());
    
    switch (command) {
      case "draw":
        await drawImage(message, commandArgs.join(" "));
        break;
      case "prompt":
        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
          const photoUrl = event.messageReply.attachments[0].url;
          const description = await describeImage(commandArgs.join(" "), photoUrl);
          message.reply(`🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nDescription: ${description}\n━━━━━━━━━━━━━━━━`);
        } else {
          message.reply("🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nPlease reply to an image to describe it.\n━━━━━━━━━━━━━━━━");
        }
        break;
      default:
        const gptResponse = await getGPTResponse(args.join(" "), senderID);
        message.reply(`🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\n${gptResponse}\n━━━━━━━━━━━━━━━━`);
        break;
    }
  } catch (error) {
    handleErrorMessage(error, message);
  }
}

async function drawImage(message, prompt) {
  try {
    const image = await getImage(prompt);
    const imagePath = path.join(__dirname, 'cache', `image_${Date.now()}.png`);
    fs.writeFileSync(imagePath, image);
    message.reply({
      body: "🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nGenerated image:\n━━━━━━━━━━━━━━━━",
      attachment: fs.createReadStream(imagePath)
    });
  } catch (error) {
    handleErrorMessage(error, message);
  }
}

function handleErrorMessage(error, message) {
  console.error("Error:", error.message);
  message.reply(`🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n━━━━━━━━━━━━━━━━\nAn error occurred while processing the request.\n━━━━━━━━━━━━━━━━`);
}

module.exports = {
  config,
  handleCommand,
  onStart: ({ api, message, event, args }) => handleCommand({ api, message, event, args }),
  onReply: ({ api, message, event, args }) => handleCommand({ api, message, event, args })
};