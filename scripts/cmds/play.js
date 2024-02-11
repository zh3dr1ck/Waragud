const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const axios = require("axios");

const FILE_SIZE_LIMIT_MB = 25;

module.exports = {
  config: {
    name: "play",
    version: "1.0",
    author: "Coffee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Play a song with lyrics",
    },
    longDescription: {
      en: "This command allows you to play a song and display its lyrics. Usage: !play <song name>",
    },
    category: "music",
    guide: {
      en: "{prefix}play <song name>",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const songName = args.join(" ");

      if (!songName) {
        return api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
      }

      const searchResults = await yts(songName);

      if (!searchResults.videos.length) {
        return api.sendMessage("Error: Song not found.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;
      const stream = ytdl(videoUrl, { filter: "audioonly" });
      const fileName = `music.mp3`;
      const filePath = `${__dirname}/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', async () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
          fs.unlinkSync(filePath);
          return api.sendMessage(`[ERR] The file could not be sent because it is larger than ${FILE_SIZE_LIMIT_MB}MB.`, event.threadID, event.messageID);
        }

        await handleLyrics(api, event, video, filePath, songName);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage("Error processing the request.", event.threadID, event.messageID);
    }
  },
};

async function handleLyrics(api, event, video, filePath, songName) {
  const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`;

  try {
    const response = await axios.get(apiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      return api.sendMessage(`🎧 | Title: ${video.title}\n🎤 | Artist: ${video.author.name}\n\nSorry, lyrics not found!`, event.threadID, event.messageID);
    } else {
      const formattedMessage = `🎧 | Title: ${video.title}\n🎤 | Artist: ${video.author.name}\n\n${lyrics}`;
      const replyMessage = {
        body: formattedMessage,
        attachment: fs.createReadStream(filePath),
      };
      await api.sendMessage(replyMessage, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(`Error getting lyrics for "${songName}"!`, event.threadID, event.messageID);
  }
}