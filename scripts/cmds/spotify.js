const axios = require("axios");
const fs = require('fs');
const path = require('path');

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = {
  config: {
    name: "spotify",
    version: "1.0",
    author: "Rishad",
    countDown: 10,
    role: 0,
    shortDescription: "play songs from spotify",
    longDescription: "Download Spotify musics by searching",
    category: "music",
    guide: "{pn} song title"
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");

    if (!query) {
      return message.reply("provide song by title");
    }

    const SearchapiUrl = `https://for-devs.onrender.com/api/spsearch?apikey=fuck&query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(SearchapiUrl);
      const tracks = response.data.slice(0, 6);

      if (tracks.length === 0) {
        return message.reply("❎ No tracks found for the given query.");
      }

      const topTrack = tracks[0]; // Selecting the top track

      const SpdlApiUrl = 'https://for-devs.onrender.com/api/spotifydl?apikey=fuck&url=' + encodeURIComponent(topTrack.url);

      const apiResponse = await axios.get(SpdlApiUrl);

      if (apiResponse.data.id) {
        const {
          artists,
          title,
          album,
          releaseDate,
          downloadUrl
        } = apiResponse.data;

        const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        
        const cacheDir = path.join(__dirname, 'cmds', 'cache');
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        const audioFilePath = path.join(cacheDir, 'spotifyAudio.mp3');
        fs.writeFileSync(audioFilePath, Buffer.from(audioResponse.data));

        const fileSize = fs.statSync(audioFilePath).size;
        const sizeFormatted = formatSize(fileSize);

        const attachment = fs.createReadStream(audioFilePath);

        const form = {
          body: `🎧 | Playing: ${title}...`,
          attachment: attachment
        };

        message.reply(form);
      } else {
        message.reply("Sorry, the Spotify content could not be downloaded.");
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("Error: " + error, event.threadID);
    }
  },
};