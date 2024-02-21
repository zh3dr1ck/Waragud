const axios = require("axios");
const { getPrefix, getStreamFromURL, uploadImgbb } = global.utils;

async function ai({ message: m, event: e, args: a, usersData: u }) {
  const prefixes = [
    `${await getPrefix(e.threadID)}${this.config.name}`,
    this.config.name
    /*"ai"
    *you can add more prefix here
    */
  ];

  if (prefixes.some(prefix => a[0].toLowerCase().startsWith(prefix))) {
    try {
      let prompt = "ai";
      if (e.type === "message_reply" && e.messageReply.attachments && e.messageReply.attachments[0]?.type === "photo") {
        const { image } = await uploadImgbb(e.messageReply.attachments[0].url);
        prompt = `${a.slice(1).join(" ")} ${image.url}`;
      } else {
        prompt = a.slice(1).join(" ");
      }

      const sender = { id: e.senderID, tag: await u.getName(e.senderID) };
      const response = await axios.post(`https://test-ai-ihc6.onrender.com/api`, {
        prompt,
        apikey: "GayKey-oWHmMb1t8ASljhpgSSUI",
        name: sender.tag,
        id: sender.id,
      });

      const result = response.data.result.replace(/{name}/g, sender.tag).replace(/{pn}/g, prefixes[0]);

      if (response.data.av) {
        const attachments = Array.isArray(response.data.av)
          ? await Promise.all(response.data.av.map(url => getStreamFromURL(url)))
          : await getStreamFromURL(response.data.av);

        m.reply({ body: `🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━`, mentions: [] , attachment: attachments });
      } else {
        m.reply({ body: `🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━`, mentions: [] });
      }
    } catch (error) {
      m.reply("🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\nError: \n━━━━━━━━━━━━━━━━" + error.message);
    }
  }
}

module.exports = {
  config: {
    name: "ai",
    aliases: [],
    version: 1.6,
    author: "Jun",
    role: 0,
    shortDescription: "An AI that can do various tasks",
    guide: "{pn} <query>",
    category: "AI"
  },
  onStart() {},
  onChat: ai
};