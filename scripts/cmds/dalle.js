const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACKBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACDzeOnpi//80SARFS9gGzHFLktDx5L1rTSNqE9/ZqnGY997u9YjR0i7fkKLrGA1REUsu9YO2UroU+TgMTfYZ960yLChhEu+2vZMb27d+QPP3rlEqzFJuZZEyel4FP3IuuXs3W9TMljS0KZMBWvUQ/rI/hfQrYK7QoD7IREXH8+o1I42b9g2Ibw6j4+DEvT3rbqO3Ixqlme+nAR2F3aPo/BHdaHtcKJNEh7i61WzO0ykkGJ5u4Y5EjszSHGwfMs8EQulNwpBX/2J8T/eFecXzHZb4Xv8uEcFQQX3FJ8HEvVeARjUWPiVF5893liCitY1UjbkpkCRgSz7ke4gJp31mG+M9M+aoSCubAOlzfJlbfy9ECnkJPtMAWkMR3ARLK8CxSxlEPAJNwuoJoQCxD6yNkkNexFd4UNka8uOQb+OjrG1LMF5OjmLS+4QJ8qc+y53GFj45jYen6QvhpCUzVixR/esAEEcJLGsKfKqoSgkFyoDH20V2ojl5osEF54HcS2nvnjj5hXmnHTwXcW+ClJ6dfpiVp/vYMtAEndazQ6SxzSvkkuEZ56dcrNH1yVF9Qfv/qg3WME2v6N74wNqLwkVAfZkahKH97XExkKiFKUiQk1rkpOCZMFuTGg+eOKaEpNzDQdiumqQIEWjq8d0ZXgfCMzLT2JeEygN1lj8/bDO8rYsCRs+v5SdTxuJdQLPx1RO0sCcT/1kyVG70/YOn8LL+gEp242ernhju/npOhBX3gS0QPyx1+IWBM1TI9tsftvyxnNl+J+3y5a7htiMkKmNsBJMLnYjRZiehkF0IcAwx9gkBijixFx/LY8rxTqGCLT16vXSJd+T4oshgcagoMfMmwX1N+WFokOH2CADFLx1trYl9LQPP1sJtdjCnGmCzLAJ1fxwiysOu4LCXLdTC9SEa1X2c35RcSLP+1K/UX7pm9fR5D2V5+j9KoYrnJ0qlNr0QUizV0LAD+e9nYpRXXF4iAu+GyidVMukkfbv4RoRJAiHCuw6ZDQaTj5dad4ZVIgyycd55pnXHh+52Z8xlIXcnsPL4CdpbivaJqXvvTwzoR8/cmGJyYb3U9obvxjwbJZNDuZNoTUCjiE/rz9lgV5KN3lDeHQ1uRAEB/npuUIbnwp3xtqfmud/gEdQBksMS4CMM8xkL4BFDhF30Czjo4mzoEzzJ5W/5P6E5ggT3kMZWXiGj0GZAy4kME+ugf2LKG/32N2DBJJBs+8uKU5cxhCNSjfe1jXKYjuwp3EhJgjJyQrDIBGwl06Qxh8wLrvF0gj/QrWsUlRhVBPtnBCZUZ7209B0QQRHfB0SyAn975vLH1f05gMpJ+ewdX5ZoLn/SqkRLWspW8JqZJj9gW0ezzjAYcnX5UdWYthGy5NQzpijaqYoinJXFV0HE6SSs3ZsP0pYRmxUIgZUF6WAkQh/pfJw3WxrCAOqfYQ1PztQD5x71ykO1tkoxyxunrAONeLFiH3jqwvLfFACsKSH6K4LpkLkTWr/BJmvwiV2R7A==";
const _U = "1E77TEw4mqgSxhZsnuBp0vv1slo1X3QosqilnrQAmJ77C82TjSEIEY-olm6KZPHTP7ipfzEuq9uYd1seGfXaA4ZBA_nOG2LLp7Cp0TwlaxE7zg8f20C4ShaSoR1A6LChInZdc-YsE4T15oUCsXjNtruopCBC22QID75N7rLusNsUT9vhU92Epy_6GS8AWBC0eTbGel0QeF88-IFrIuU9u8qeAd0Rp6ZljkB3uZ-M4MRI";

const badWords = ["nsfw","gay", "pussy", "dick","nude"," without","clothes","sugar","fuck","fucked","slut","🤭","🍼","shit","bitch","hentai","🥵","clothes","sugar","smut","naked","penis","🍑","👄","💋","bitch","hentai","?","sex","😋","boobs","🤤","undressed", "nude","😛","bra","dick","arse","asshole","ass","crack","fellatio","blow job","suck","hot","bikini","👙","💦","🍆","👌","🖕","😝","😜","🤪","🥴","🥺","cock","vagina","pedo","lips","69","yuck","gae","milf","prostitute","without clothe","cock","porn","pervert","seduce","seduction","panty","underwear","undergarment","hentai","ahegao"]; // Add appropriate NSFW words to this array

module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "generate image using your imagination"
    },
    longDescription: {
      en: ""
    },
    category: "image",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const uid = event.senderID;
    const permission = [`${uid}`];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    // Check for NSFW content
    if (containsBadWords(keySearchs)) {
      api.sendMessage("(⁠‘⁠◉⁠⌓⁠◉⁠’⁠) | no pervert allowed.", event.threadID, event.messageID);
      return;
    }

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};

function containsBadWords(prompt) {
  const promptLower = prompt.toLowerCase();
  return badWords.some(badWord => promptLower.includes(badWord));
}