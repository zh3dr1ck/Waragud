const { exec } = require('child_process');

module.exports = {
  config: {
    name: 'uptime',
    version: '1.0',
    author: 'Cruizex',
    role: 0,
    description: {
      en: 'Display the system uptime.',
    },
    category: 'Utility',
    guide: {
      en: '{pn} uptime',
    },
  },

  getUptime: function (callback) {
    const command = 'uptime -p';

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        callback('An error occurred while fetching uptime.');
        return;
      }

      const uptimeString = stdout.trim();
      const formattedUptime = uptimeString.replace(/up\s+/i, ''); // Remove "up" prefix
      const days = formattedUptime.match(/\d+ days?/) || ['0 days']; // Extract days
      const hours = formattedUptime.match(/\d+ hours?/) || ['0 hours']; // Extract hours
      const minutes = formattedUptime.match(/\d+ minutes?/) || ['0 minutes']; // Extract minutes

      const formattedResult = `━|  (⁠ ⁠˘⁠ ⁠³⁠˘⁠)┌旦「 𝙾𝚗𝚕𝚒𝚗𝚎 」|━\n${days[0]} ${hours[0]} ${minutes[0]}`;
      callback(formattedResult);
    });
  },

  onStart: function ({ api, event }) {
    this.getUptime((result) => {
      api.sendMessage(result, event.threadID, event.messageID);
    });
  },
};