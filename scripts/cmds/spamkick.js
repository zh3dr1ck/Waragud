let messageCounts = {};
const spamThreshold = 2; 
const spamInterval = 60000;

module.exports = {
  config: {
    name: "spamkick",
    aliases: [],
    version: "1.0",
    author: "Jonell Magallanes & BLUE & kshitiz & coffee",
    countDown: 5,
    role: 2,
    shortDescription: "Automatically detect and act on spam",
    longDescription: "Automatically detect and act on spam",
    category: "..",
    guide: "{pn}",
  },

  onStart: ({ api, event }) => {
    api.sendMessage("This command functionality kicks the user when they are spamming in group chats", event.threadID, event.messageID);
  },

  onChat: ({ api, event }) => {
    const { threadID, messageID, senderID } = event;

    messageCounts[threadID] = messageCounts[threadID] || {};

    if (!messageCounts[threadID][senderID]) {
      messageCounts[threadID][senderID] = {
        count: 1,
        timer: setTimeout(() => delete messageCounts[threadID][senderID], spamInterval),
      };
    } else {
      const userCount = ++messageCounts[threadID][senderID].count;

      if (userCount > spamThreshold) {
        api.sendMessage("🛡 | Detected spamming. The bot will remove the user from the group", threadID, messageID);
        api.removeUserFromGroup(senderID, threadID);
      }
    }
  },
};