const messageCounts = {};
const spamThreshold = 3;
const spamInterval = 45000;
const excludedUser = '100005954550355';

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

    // Exclude specific user from being kicked
    if (senderID === excludedUser) return;

    messageCounts[threadID] ??= {};

    messageCounts[threadID][senderID] ??= { count: 0 };

    messageCounts[threadID][senderID].count++;

    if (messageCounts[threadID][senderID].count > spamThreshold) {
      api.sendMessage("🛡 | Detected spamming. The bot will remove the user from the group", threadID, messageID);
      api.removeUserFromGroup(senderID, threadID);
    }

    // Reset count after spamInterval
    clearTimeout(messageCounts[threadID][senderID].timer);
    messageCounts[threadID][senderID].timer = setTimeout(() => {
      messageCounts[threadID][senderID].count = 0;
    }, spamInterval);
  },
};