const axios = require('axios');
const apii = `https://gemini-api.replit.app`;
module.exports = {
  config: {
    name: 'gemini',
    author: 'Charlie | API by Deku',
    role: 0,
    category: 'ai',
    shortDescription: 'gemini (conversational)',
  },
  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' '),
    uid = event.senderID;
    let url;
    if (!prompt) return message.reply('👩‍💻 | 𝙶𝚎𝚖𝚒𝚗𝚒 | \n━━━━━━━━━━━━━━━━\nMissing prompt.\n━━━━━━━━━━━━━━━━');
    if (event.type == "message_reply"){
        if (event.messageReply.attachments[0]?.type == "photo"){
            url = encodeURIComponent(event.messageReply.attachments[0].url);
            const res = (await axios.get(apii + "/gemini?prompt="+prompt+"&url="+url+"&uid="+uid)).data;
            return message.reply('👩‍💻 | 𝙶𝚎𝚖𝚒𝚗𝚒 | \n━━━━━━━━━━━━━━━━\n' + res.gemini + '\n━━━━━━━━━━━━━━━━');
        } else {
            return message.reply('👩‍💻 | 𝙶𝚎𝚖𝚒𝚗𝚒 | \n━━━━━━━━━━━━━━━━\nPlease reply to an image.\n━━━━━━━━━━━━━━━━');
        }
    }
    const rest = (await axios.get(apii + "/gemini?prompt=" + prompt + "&uid=" + uid)).data;
    return message.reply('👩‍💻 | 𝙶𝚎𝚖𝚒𝚗𝚒 | \n━━━━━━━━━━━━━━━━\n' + rest.gemini + '\n━━━━━━━━━━━━━━━━');
  }
}