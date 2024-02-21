const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pinterest2",
    aliases: ["pin2"],
    version: "1.0.2",
    author: "JVB",
    role: 0,
    countDown: 50,
    shortDescription: {
      en: "Search for images on Pinterest"
    },
    longDescription: {
      en: ""
    },
    category: "image",
    guide: {
      en: "{prefix}pinterest2 cat -5"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const keySearch = args.join(" ");
      let numberSearch = parseInt(keySearch.split("-").pop().trim()) || 1;
      numberSearch = Math.min(Math.max(numberSearch, 1), 21);

      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();

      const { data } = await axios.get(`https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(keySearchs)}`);

      if (!Array.isArray(data) || data.length === 0) {
        return api.sendMessage(`📷 | Follow this format:\n-pinterest2 cat -4`, event.threadID, event.messageID);
      }

      const imgData = await Promise.all(data.slice(0, numberSearch).map(async (item, i) => {
        const imageUrl = item.image;

        try {
          const { data: imgBuffer } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgBuffer);
          return fs.createReadStream(imgPath);
        } catch (error) {
          console.error(error);
          return null; // Skip problematic image
        }
      }));

      await api.sendMessage({
        attachment: imgData.filter(img => img !== null), // Filter out null (skipped) images
        body: `Here are the top ${imgData.length} image results for "${keySearchs}":`
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(`📷 | Follow this format\n-pinterest2 cat -4`, event.threadID, event.messageID);
    }
  }
};