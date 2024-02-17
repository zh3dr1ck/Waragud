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
      const [command, emailAddress] = args.map(arg => arg.toLowerCase());

      if (!command) {
        return api.sendMessage("❌ Please specify 'inbox' or 'create' as the first argument.", event.threadID);
      }

      if (command === 'inbox') {
        if (!emailAddress) {
          return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
        }

        const { data: messages } = await axios.get(`https://api-turtle.onrender.com/api/premium/mail/${emailAddress}`);

        if (!messages || messages.length === 0) {
          return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID, event.messageID);
        }

        const messageText = messages.map(message => `
          📧 Sender: ${message.from}
          📑 Subject: ${message.subject || 'Empty'}
          📩 Message: ${message.body}
        `).join('\n\n');

        api.sendMessage(`📬 Inbox Messages: 📬\n\n${messageText}`, event.threadID);
      } else if (command === 'create') {
        const { data: tempMailData } = await axios.get("https://api-turtle.onrender.com/api/premium/mail/create");

        if (!tempMailData.email) {
          return api.sendMessage("Failed to generate temporary email.", event.threadID, event.messageID);
        }

        api.sendMessage(`📩 Here's your generated temporary email: ${tempMailData.email}`, event.threadID);
      } else {
        return api.sendMessage("Please specify 'inbox' or 'create'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};