const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACKBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACHblgTOGlgPmSAQHkMLKfDjTzpeUfrKFWLMMHul4ggRdl2GrA0VfkMaTsR9UWyQ1A2sMMgj6DjLZsOLuvEalmqQvHURhKW3iVOHOI1UT4QTzu/h/uK0nLj0rNXREDqpIDwg+zAtMbVYKJ//tJpVa34OwPIRveXg3tHzRtHzpwdlPXdTBMv/FUAnCMv2pXwThngD0Sxj5W4HqHwBtEeZR1KnwyCM8WL0fFmd7GMzMrzdivub7PLXbNIn0HeYM03i4iSEV9ErL79s8I8kchCgefrSa9NdrIkY8FsT0RUn3UwynXezrJzjyWAkTYI0wpfHbwF/4gQMwfUy+zp0HCgW76ye1mQVPsvrCwhcIoxCPdAECOlDihvDa2nfbOgUgChcDXZlRz1BrOfNTFd+2yT/J9ccWealgdjaln2eUFZzHnCX8k+NW15SfKwz2TpCezJsfLuw7xMLxZJ3yPYUJ8zudhrzF2YeoOr/wLk8Xvbbh3sxInWjQWxj34iBARuL8yDUmU1KhpbeHqTadXndo5YIxlO6Ht/3BEZWfufrEL0TTUrekNc2WcMTk3ERjqU+rLE7TaHkraYLD90+0tRI1mqcphl5p1p2/93KK+wMSIOH7suXQ5VlUyFELoDvAbRbOipXjnb/31vbym+V9ev83byFERiT5RQrZ0g8yaUvLSWee1zS1ICbwx+wNCHCvPF3DZZJc1pp8zWsPYCVsW+XMdbvO0VdddHiqC/5CD4/UEUwignfLjIVE16xYn8OzCD36C5+AVzK96BTK2xeu03Ssf1OtaOLX+hAHLpcjjXoEXRpo1mMVfTB4qYBncxI1eHbfpXDsL48jzepPOtP71qvzZZv/DW5JYQAUNRQ+pK6cIp8t496Co6WXTUMZZv4m4eOfL9R6/oexXWLG9QnjwtIDZF8fiYIqLxFa04ExCrzXfL9pT+Jw6ZZi8EzXeKqhCk8hu8UKYFKx7oiudA1XAB2VQZCYVLjQVe3GPopjczZpGWtJ9kCyXYrFZ/uFZ06vnhpg2SnMbojWMWAYintDYw4fu5a655n0b5mz1eWa1+a6eQmKyKwUOEHI14RWTJ5PX/jYtCK/3PAKvrbIqdgXMKVKSp1oT6Eg5JXrZfvvgbvyZV4m2a65A1AmZBkEj4rWcKgylxuEUeCvg04ySsAnV6UzhMKxyQEL5xhUnfemx9MMiA6L47wweTsCUTgpctish9w/58vcWI0vEIX1bA+71LfqIL0KAwHA7mFOD/6lNDwysvrXPaG0JTv7V7V8A+GVZ9B2/zCsSgmy1gga1i/a50s5NE4C7FqdG3DenDAZyCF+X0VVt2vu+hx7BfSNeBZYjyUiTjYcvX8hv4n1+PsIV6FfyRBolImwKjHE8K+l/IXsr9236EZU6wuduo4UWiPZaE3CVdZq26tPK1oSaFaT6+BDW7FWZvhZzcqbnSZPdXtzAZDq7opxiPNQ+bG02JIKapL5lgPo56vqFADESKh+JZ/61exkBTDe0xo1z06Ugg==";
const _U = "1z29WfVE58SMtcc32aIaOYN-x8WVWSvuVWOyyNRgEcdaFvAhBsqEfDl-0dBiWTnGyjvuqk9nXG1uag8pHloaw2dvVtDOpYl3zQm6bXPN48axb9k_fsdVL8WR6WxsiHTPqI8GHPL97jEomFbZdZ4Tffcc21VfGt4oY_bCwtJbFP9RXhy0LUSLwmXUxPt5ELOIK03p1rgwvKFwfaz8MvPpX1VRB2LqT0tt_a70NmzR8LWo";

const badWords = ["nsfw","gay", "pussy", "dick","nude"," without","clothes","sugar","fuck","fucked","slut","🤭","🍼","shit","bitch","hentai","🥵","clothes","sugar","smut","naked","penis","🍑","👄","💋","bitch","hentai","?","sex","😋","boobs","🤤","undressed", "nude","😛","bra","dick","arse","asshole","ass","crack","fellatio","blow job","suck","hot","bikini","👙","💦","🍆","👌","🖕","😝","😜","🤪","🥴","🥺","cock","vagina","pedo","lips","69","yuck","gae","milf","prostitute","without clothe","cock","porn","pervert","seduce","seduction","panty","underwear","undergarment","hentai","ahegao"]; // Add appropriate NSFW words to this array

let dailyUsageCounter = {};

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

    // Check daily usage limit
    const today = new Date().toLocaleDateString();
    dailyUsageCounter[today] = dailyUsageCounter[today] || 0;
    if (dailyUsageCounter[today] >= 10) {
      api.sendMessage("Daily usage limit reached. Please wait until tomorrow to use the command again.", event.threadID, event.messageID);
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
        const imgPath = path.join(__dirname, 'tmp', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

      // Increment daily usage counter
      dailyUsageCounter[today]++;
    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'tmp'));
    }
  }
};

function containsBadWords(prompt) {
  const promptLower = prompt.toLowerCase();
  return badWords.some(badWord => promptLower.includes(badWord));
}