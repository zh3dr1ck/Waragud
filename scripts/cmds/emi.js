const fs = require("fs");
const path = require("path");
const axios = require("axios");

const badWords = ["nsfw","gay", "pussy", "dick","nude"," without","clothes","sugar","fuck","fucked","slut","🤭","🍼","shit","bitch","hentai","🥵","clothes","sugar","smut","naked","penis","🍑","👄","💋","bitch","hentai","?","sex","😋","boobs","🤤","undressed", "nude","😛","bra","dick","arse","asshole","ass","crack","fellatio","blow job","suck","hot","bikini","👙","💦","🍆","👌","🖕","😝","😜","🤪","🥴","🥺","cock","vagina","pedo","lips","69","yuck","gae","milf","prostitute","without clothe","cock","porn","pervert","seduce","seduction","panty","underwear","undergarment","hentai","ahegao"]; // Add appropriate NSFW words to this array

module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image.",
    longDescription: "Generates an image.",
    category: "fun",
    guide: "{p}imagine <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("🕰", event.messageID, (err) => {}, true);
    try {
      const prompt = args.join(" ");
      
      // Check for NSFW content
      if (containsBadWords(prompt)) {
        return message.reply("(⁠‘⁠◉⁠⌓⁠◉⁠’⁠) | no pervert allowed");
      }

      const emiApiUrl = "https://ai-tools.replit.app/emi";

      const emiResponse = await axios.get(emiApiUrl, {
        params: {
          prompt: prompt
        },
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "/tmp");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};

function containsBadWords(prompt) {
  const promptLower = prompt.toLowerCase();
  return badWords.some(badWord => promptLower.includes(badWord));
}