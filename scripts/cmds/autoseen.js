module.exports = {
  config: {
name: "autoseen",
    aliases: [],
    version: "1.0",
    author: "Kshitiz",
    countDown: 10,
    role: 2,
    shortDescription: "",
    longDescription: "",
    category: "..",
    guide: "{p}"
  },

  onChat: function({ api, event, args }) {
    api.markAsReadAll(() => {});
  },

  onStart: async function ({}) {
   
  }
};