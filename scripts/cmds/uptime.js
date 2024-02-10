module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "Coffee",
    shortDescription: "view how long bot is online",
    category: "members"
  },
  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${hours} Hrs ${minutes} mins ${seconds} secs...`;
      api.sendMessage(`(⁠ ⁠˘⁠ ⁠³⁠˘⁠)┌旦「 𝙾𝚗𝚕𝚒𝚗𝚎 」\n ${uptimeString}`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving data.", event.threadID);
    }
  }
};