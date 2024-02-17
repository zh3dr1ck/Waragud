const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    role: 0,
    countdown: 5,
    author: "Rehat86 | @Turtle APIs",
    longDescription: "Create temporary email and check inbox messages",
    category: "media",
  },

  onStart: async ({ api, event, args }) => {
    try {
      const command = (args[0] || '').toLowerCase();
      
      switch (command) {
        case 'inbox':
          const emailAddress = args[1];
          if (!emailAddress) {
            return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
          }
          const inboxResponse = await axios.get(`https://api-turtle.onrender.com/api/premium/mail/${emailAddress}`);
          const messages = inboxResponse.data;
          if (!messages || messages.length === 0) {
            return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID, event.messageID);
          }
          const messageText = messages.map(message => {
            return `📧 Sender: ${message.from}\n📑 Subject: ${message.subject || 'Empty'}\n📩 Message: ${message.body}\n`;
          }).join('\n');
          api.sendMessage(`📬 Inbox Messages: 📬\n\n${messageText}`, event.threadID);
          break;

        case 'create':
          const tempMailResponse = await axios.get("https://api-turtle.onrender.com/api/premium/mail/create");
          const tempMailData = tempMailResponse.data;
          if (!tempMailData.email) {
            return api.sendMessage("Failed to generate temporary email.", event.threadID, event.messageID);
          }
          api.sendMessage(`📩 Here's your generated temporary email: ${tempMailData.email}`, event.threadID);
          break;

        default:
          api.sendMessage("Please specify 'inbox' or 'create'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};