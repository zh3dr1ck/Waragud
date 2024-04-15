const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const ytdl = require("ytdl-core");
const yts = require("yt-search");

async function lado(api, event, args, message) {
  try {
    const songName = args.join(" ");
    const searchResults = await yts(songName);

    if (!searchResults.videos.length) {
      message.reply("No song found for the given query.");
      return;
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const stream = ytdl(videoUrl, { filter: "audioonly" });
    const fileName = `music.mp3`; 
    const filePath = path.join(__dirname, "tmp", fileName);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      const audioStream = fs.createReadStream(filePath);
      message.reply({ attachment: audioStream });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  } catch (error) {
    console.error("Error:", error);
    message.reply("Sorry, an error occurred while processing your request.");
  }
}

async function kshitiz(api, event, args, message) {
  try {
    const query = args.join(" ");
    const searchResults = await yts(query);

    if (!searchResults.videos.length) {
      message.reply("No videos found for the given query.");
      return;
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const stream = ytdl(videoUrl, { filter: "audioandvideo" }); 
    const fileName = `music.mp4`;
    const filePath = path.join(__dirname, "tmp", fileName);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      const videoStream = fs.createReadStream(filePath);
      message.reply({ attachment: videoStream });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  } catch (error) {
    console.error(error);
    message.reply("Sorry, an error occurred while processing your request.");
  }
}

async function b(prompt, uid) {
  try {
    const response = await axios.get(`https://gpt-four.vercel.app/gpt?prompt=${encodeURIComponent(prompt)}&uid=${uid}`);
    return response.data.answer;
  } catch (error) {
    throw error;
  }
}

async function generateImage(prompt) {
  try {
    const response = await axios.get(`https://sdxl-kshitiz.onrender.com/gen?prompt=${encodeURIComponent(prompt)}&style=3`);
    return response.data.url;
  } catch (error) {
    throw error;
  }
}

async function describeImage(prompt, photoUrl) {
  try {
    const url = `https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`;
    const response = await axios.get(url);
    return response.data.answer;
  } catch (error) {
    throw error;
  }
}

async function drawImage(message, prompt) {
  try {
    const imageUrl = await generateImage(prompt);

    const imagePath = path.join(__dirname, 'cache', `image_${Date.now()}.png`);
    const writer = fs.createWriteStream(imagePath);

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    }).then(() => {
      message.reply({
        body: "Generated image:",
        attachment: fs.createReadStream(imagePath)
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

async function handleCommand({ api, message, event, args }) {
  try {
    const senderID = event.senderID;
    let action = "";
    let drawImageFlag = false;
    let sendVideoFlag = false;
    let playMusicFlag = false;

    if (args[0].toLowerCase() === "draw") {
      drawImageFlag = true;
      action = args.slice(1).join(" ").trim();
    } else if (args[0].toLowerCase() === "send") {
      sendVideoFlag = true;
      action = args.slice(1).join(" ").trim();
    } else if (args[0].toLowerCase() === "sing") {
      playMusicFlag = true;
      action = args.slice(1).join(" ").trim();
    } else if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      const photoUrl = event.messageReply.attachments[0].url;
      action = args.join(" ").trim();
      const description = await describeImage(action, photoUrl);
      message.reply(`🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \nDescription: ${description}\n━━━━━━━━━━━━━━━━`);
      return;
    } else {
      action = args.join(" ").trim();
    }

    if (!action) {
      return message.reply("Please provide a prompt.");
    }

    if (drawImageFlag) {
      await drawImage(message, action);
    } else if (sendVideoFlag) {
      await kshitiz(api, event, args.slice(1), message); 
    } else if (playMusicFlag) {
      await lado(api, event, args.slice(1), message); 
    } else {
      const response = await b(action, senderID);
      message.reply(`🗨 | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃 | \n${response}`, (replyMessage, sentMessage) => {
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: config.name,
          uid: senderID 
        });
      });
    }
    
    // Add footer to every reply
    message.reply('━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

const config = {
  name: "gpt",
  aliases: ["chatgpt"],
  version: "5.0",
  author: "vex_kshitiz",
  countDown: 5,
  role: 0,
  longDescription: "Chat with GPT",
  category: "AI",
  guide: {
    en: "{p}gemini {prompt}"
  }
};

module.exports = {
  config: config,
  handleCommand: handleCommand,
  onStart: function ({ api, message, event, args }) {
    return handleCommand({ api, message, event, args });
  },
  onReply: function ({ api, message, event, args }) {
    return handleCommand({ api, message, event, args });
  }
};