const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.0",
    author: "rehat--",
    role: 0,
    countDown: 5,
    longDescription: {
      en: "Generate images using dalle 3"
    },
    category: "ai",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    const keySearch = args.join(" ");
if (!keySearch) return message.reply("what you want me to make?");
    message.reply("(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠) I'm currently working on it. Please be patient.");

    try {
        const res = await axios.get(`https://api-turtle.onrender.com/api/dalle?prompt=${keySearch}&cookie=151APXZc-p_34dLclwdyPCofmXEQl-UcbiDZEGnpEdrhPBgGI-Te8KoDVUQdf4YEkxUmwp_FmkUndrbbGHvAFbQNt7kWCYqBrsbQi8BKJaXDllgUxMGhqaAKpDVZjJ9OxvxKASSO0LwWnj-iQwzys_dIJHIIHUgp2YLoC1O6FZWGBo_lanXb03sm9B1qFnlt9D88R3POvMtqTMgXygZXGMn3ybtXKsFMthGYQnGXNLa4`);// add your bing cookie _u value!!
        const data = res.data.result

        if (!data || data.length === 0) {
            api.sendMessage("An error occurred.", event.threadID, event.messageID);
            return;
        }

        const imgData = [];
        for (let i = 0; i < data.length; i++) { // No need to limit to Math.min(numberSearch, data.length)
            const imgUrl = data[i];
            const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, 'tmp', `${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            attachment: imgData,
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred.", event.threadID, event.messageID);
    } finally {
        await fs.remove(path.join(__dirname, 'tmp'));
    }
  }
}