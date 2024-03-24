const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
  threadStates: {},
  config: {
    name: 'alldl',
    version: '3.0',
    author: 'Vex_Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'Auto video downloader for Instagram, Facebook, TikTok, Twitter, pinterest and youtube',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on'; 
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (event.body.toLowerCase().includes('autolink off')) {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned off for this chat.", event.threadID, event.messageID);
    } else if (event.body.toLowerCase().includes('autolink on')) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("AutoLink is now turned on for this chat.", event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;

    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(`Attempting to download from URL: ${url}`);
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, api, event, true); // Pass true to indicate sending attachments
      } else {
        api.sendMessage("", event.threadID, event.messageID);
      }
      api.setMessageReaction("🕰️", event.messageID, (err) => {}, true);
    }
  },
  downLoad: function (url, api, event, sendAttachments = false) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, api, event, path, sendAttachments);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, api, event, path, sendAttachments);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, api, event, path, sendAttachments);
    } else if (url.includes("x.com")) {
      this.downloadTwitter(url, api, event, path, sendAttachments);
    } else if (url.includes("pin.it")) {
      this.downloadPinterest(url, api, event, path, sendAttachments);
    } else if (url.includes("youtu")) {
      this.downloadYouTube(url, api, event, path, sendAttachments);
    }
  },
  downloadInstagram: async function (url, api, event, path, sendAttachments) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `${shortUrl}`;

      if (sendAttachments) {
        api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      } else {
        api.sendMessage(messageBody, event.threadID, event.messageID);
      }
    } catch (err) {
      console.error(err);
    }
  },
  // Implement similar modifications for other download functions

  getLink: function (url, api, event, path) {
    return new Promise((resolve, reject) => {
      if (url.includes("instagram")) {
        axios({
          method: "GET",
          url: `https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`
        })
        .then(res => {
          console.log(`API Response: ${JSON.stringify(res.data)}`);
          if (res.data.url) {
            resolve(res.data.url);
          } else {
            reject(new Error("Invalid response from the API"));
          }
        })
        .catch(err => reject(err));
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            resolve(videoUrl);
          } else {
            reject(new Error("Invalid response from the Facebook downloader"));
          }
        }).catch(err => reject(err));
      } else if (url.includes("tiktok")) {
        this.queryTikTok(url).then(res => {
          resolve(res.downloadUrls);
        }).catch(err => reject(err));
      } else {
        reject(new Error("Unsupported platform. Only Instagram, Facebook, and TikTok are supported."));
      }
    });
  },
  // Implement similar modifications for other functions
  
  checkLink: function (url) {
    if (
      url.includes("instagram") ||
      url.includes("facebook") ||
      url.includes("fb.watch") ||
      url.includes("tiktok") ||
      url.includes("x.com") ||
      url.includes("pin.it") ||
      url.includes("youtu")
    ) {
      return {
        url: url
      };
    }

    const fbWatchRegex = /fb\.watch\/[a-zA-Z0-9_-]+/i;
    if (fbWatchRegex.test(url)) {
      return {
        url: url
      };
    }

    return null;
  }
};

async function fbDownloader(url) {
  // Implementation of fbDownloader function
}