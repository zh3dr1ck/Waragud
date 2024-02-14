const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

/* Do not change the credit 🐢👑🥴 */

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "Samir Œ | rehat--",
    role: 0,
    countDown: 60,
    shortDescription: {
      en: "Search Image From Pinterest",
    },
    category: "image",
    guide: {
      en: "{pn} cat -4",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");

      // Input validation
      if (!keySearch.includes("-")) {
        throw new Error("📷 | Follow this format:\n-pinterest cat -4");
      }

      const keySearchs = keySearch.substr(0, keySearch.indexOf("-"));
      let numberSearch = parseInt(keySearch.split("-").pop()) || 1;
      numberSearch = Math.min(Math.max(numberSearch, 1), 9);

      const apiUrl = `https://api-samirxyz.onrender.com/api/Pinterest?query=${encodeURIComponent(
        keySearchs
      )}&number=${numberSearch}&apikey=global`;

      const res = await axios.get(apiUrl);
      const data = res.data.result;

      const imgData = await Promise.all(
        data.slice(0, numberSearch).map(async (imgUrl, index) => {
          const imgResponse = await axios.get(imgUrl, {
            responseType: "arraybuffer",
          });

          const imgPath = path.join(__dirname, "cache", `${index + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          return fs.createReadStream(imgPath);
        })
      );

      await api.sendMessage(
        {
          attachment: imgData,
        },
        event.threadID,
        event.messageID
      );

      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error("Error in Pinterest bot:", error.message);
      return api.sendMessage(
        ` ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};