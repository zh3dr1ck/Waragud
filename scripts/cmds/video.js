module.exports = {
  config: {
    name: "video",
    version: "1.0",
    author: "kshitiz",
    cooldowns: 40,
    shortdescription: "send YouTube video",
    category: "media",
    usages: "{pn} video name",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const fs = require("fs-extra");
    const ytdl = require("@neoxr/ytdl-core");
    const yts = require("yt-search");

    const input = event.body;
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please specify a video name.", event.threadID);
    }

    data.shift();
    const videoName = data.join(" ");

    try {
      api.sendMessage(`🕰️ | your video is loading...`, event.threadID);

      const searchResults = await yts(videoName);
      if (!searchResults.videos.length) {
        return api.sendMessage("No video found.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioandvideo" });

      const fileName = `${event.senderID}.mp4`;
      const filePath = __dirname + `/tmp/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('end', () => {
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `📹 | Title: ${video.title}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage(' An error occurred while processing the command.', event.threadID);
    }
  }
};