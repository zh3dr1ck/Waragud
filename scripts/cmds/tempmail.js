const axios = require('axios');

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: 'https://api-turtle.onrender.com/api/premium/mail/'
});

module.exports = {
  config: {
    name: "tempmail",
    version: "2.0",
    role: 0,
    countdown: 5,
    author: "Rehat86 | @Turtle APIs",
    longDescription: "Create temporary email and check inbox messages",
    category: "members",
  },

  onStart: async ({ api, event, args }) => {
    try {
      const [command, param] = args.map(arg => arg.toLowerCase());

      switch (command) {
        case 'inbox':
          if (!param) {
            return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
          }
          const { data: messages } = await apiClient.get(param);
          if (!messages || messages.length === 0) {
            return api.sendMessage(`No messages found for ${param}.`, event.threadID, event.messageID);
          }
          const messageText = messages.map(({ from, subject = 'Empty', body }) => {
            return `📧 Sender: ${from}\n📑 Subject: ${subject}\n📩 Message: ${body}\n`;
          }).join('\n');
          api.sendMessage(`📬 Inbox Messages: 📬\n\n${messageText}`, event.threadID);
          break;

        case 'create':
          const { data: { email } } = await apiClient.get('create');
          if (!email) {
            return api.sendMessage("Failed to generate temporary email.", event.threadID, event.messageID);
          }
          api.sendMessage(`📩 Here's your generated temporary email: ${email}`, event.threadID);
          break;

        default:
          api.sendMessage("Please specify 'inbox' or 'create'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};
