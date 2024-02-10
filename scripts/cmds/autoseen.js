module.exports = {
  config: {
    name: "autoseen",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    shortDescription: "automatically seens your chat, just like someone you know",
    longDescription: "automatically seens your chat, just like someone you know",
    category: "..",
  },
  onStart: async function(){}, 
  onChat: async function({
      api,
      event,
      message,
      getLang,
      args,
  }) {
      if (!this.lastSeenTime || Date.now() - this.lastSeenTime >= 2) {
          api.markAsReadAll(() => {});
          this.lastSeenTime = Date.now();
      }
  },
};