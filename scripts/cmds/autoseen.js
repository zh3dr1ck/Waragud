const path = require('path');

const pathFile = path.join(__dirname, 'tmp', 'autoseen.txt');

module.exports = {
  config: {
    name: 'autoseen',
    aliases: ['seen'],
    version: '1.0',
    author: 'coffee',
    countDown: 5,
    role: 2,
    shortDescription: 'Automatically mark all new messages as seen',
    longDescription: 'Automatically mark all new messages as seen',
    category: '..',
    guide: {
      en: "This feature is always enabled."
    }
  },

  onChat: async ({ api }) => {
    api.markAsReadAll();
  },

  onStart: async () => {
  }
};