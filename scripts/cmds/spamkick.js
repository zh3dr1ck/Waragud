const messageCounts = new Map();
const countdownTimers = new Map();
const excludedUsers = new Set(['100005954550355', '100029303256580']);
const spamThreshold = 4;
const spamInterval = 20 * 1000; // 20 seconds

module.exports = {
  config: {
    name: "spamkick",
    aliases: [],
    version: "1.0",
    author: "Jonell Magallanes & BLUE & kshitiz & coffee",
    countDown: 5,
    role: 0,
    shortDescription: "Automatically detect and act on spam",
    longDescription: "Automatically detect and act on spam",
    category: "..",
    guide: "{pn}",
  },

  onStart: ({ api, event }) => {
    api.sendMessage("This command functionality kicks the user when they are spamming in group chats", event.threadID, event.messageID);
  },

  onChat: ({ api, event }) => {
    const { threadID, senderID } = event;

    if (excludedUsers.has(senderID)) return;

    messageCounts.set(threadID, messageCounts.get(threadID) || new Map());
    const userCounts = messageCounts.get(threadID);
    userCounts.set(senderID, (userCounts.get(senderID) || 0) + 1);

    if (userCounts.get(senderID) > spamThreshold) {
      api.sendMessage("🛡 | Detected spamming. The bot will remove the user from the group", threadID);
      api.removeUserFromGroup(senderID, threadID);
      clearTimeout(countdownTimers.get(senderID));
      userCounts.set(senderID, 0);
    }

    clearTimeout(userCounts.get(senderID).timer);
    userCounts.get(senderID).timer = setTimeout(() => {
      userCounts.set(senderID, 0);
    }, spamInterval);
  },

  onJoin: ({ api, event }) => {
    const { threadID, senderID } = event;

    messageCounts.set(threadID, messageCounts.get(threadID) || new Map());
    const userCounts = messageCounts.get(threadID);
    userCounts.set(senderID, 0);

    countdownTimers.set(senderID, setTimeout(() => {
      countdownTimers.delete(senderID);
    }, 20 * 1000)); // 20 seconds
  },
};