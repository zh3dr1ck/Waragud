const axios = require('axios');

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
      if (!args[0]) {
        return api.sendMessage("(⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧ Please follow these format:\n-tempmail create\n-tempmail inbox <email>", event.threadID);
      }

      const command = args[0].toLowerCase();

      let messages;
      let tempMailData;

      // First attempt to fetch data from the first API
      try {
        if (command === 'inbox') {
          const emailAddress = args[1];
          if (!emailAddress) {
            return api.sendMessage("Please provide an email address for the inbox.", event.threadID, event.messageID);
          }

          const inboxResponse = await axios.get(`https://api-turtle.onrender.com/api/mail/${emailAddress}`);
          messages = inboxResponse.data;
        } else if (command === 'create') {
          const tempMailResponse = await axios.get("https://api-turtle.onrender.com/api/mail/create");
          tempMailData = tempMailResponse.data;
        }
      } catch (firstError) {
        console.error('First API Error:', firstError);
        // If the first API call fails, attempt to fetch data from the second API
        try {
          if (command === 'inbox') {
            const emailAddress = args[1];
            const inboxResponse = await axios.get(`https://api-samir.onrender.com/tempmail/inbox/${emailAddress}`);
            messages = inboxResponse.data;
          } else if (command === 'create') {
            const tempMailResponse = await axios.get("https://api-samir.onrender.com/tempmail/get");
            tempMailData = tempMailResponse.data;
          }
        } catch (secondError) {
          console.error('Second API Error:', secondError);
          // If both API calls fail to fetch images, send a specific message
          return api.sendMessage("(⁠  ⁠･ั⁠﹏⁠･ั⁠) can't fetch emails, api is dead.", event.threadID, event.messageID);
        }
      }

      // Process the data obtained from either API
      if (messages && messages.length > 0) {
        let messageText = '📬 Inbox Messages: 📬\n\n';
        for (const message of messages) {
          messageText += `📧 Sender: ${message.from}\n`;
          messageText += `📑 Subject: ${message.subject || 'Empty'}\n`;
          messageText += `📩 Message: ${message.body}\n`;
        }
        api.sendMessage(messageText, event.threadID);
      } else if (tempMailData && tempMailData.email) {
        api.sendMessage(`📩 Here's your generated temporary email: ${tempMailData.email}`, event.threadID);
      } else {
        api.sendMessage("No data found.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('General Error:', error);
      api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};