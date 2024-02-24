const axios = require('axios');

let lastQuery = "";

module.exports = {
    config: {
        name: "box",
        aliases: ["blackbox"],
        version: "1.0",
        author: "coffee",
        countDown: 5,
        role: 0,
        shortDescription: "BlackBox Ai Ask Anything",
        longDescription: "",
        category: "ai",
        guide: "{pn}"
    },
    onStart: async ({ api, event, args }) => {
        const { threadID, messageID } = event;

        const header = "🗃 | 𝙱𝚕𝚊𝚌𝚔 𝙱𝚘𝚡 | \n━━━━━━━━━━━━━━━━";

        if (!args[0]) {
            api.sendMessage(`${header}\nHi! How can I help you?\n━━━━━━━━━━━━━━━━`, threadID, messageID);
            return;
        }

        const query = args.join(" ");

        if (query === lastQuery) {
            api.sendMessage("", threadID, messageID);
            return;
        }

        lastQuery = query;

        api.sendMessage("", threadID, messageID);

        try {
            const { data } = await axios.get(`https://hiro-api.replit.app/ai/black?ask=${encodeURIComponent(query)}`);

            if (data && data.message) {
                api.sendMessage(`${header}\n${data.message}\n━━━━━━━━━━━━━━━━`, threadID, messageID);
            } else {
                api.sendMessage(`${header}\nSorry, no relevant answers found..\n━━━━━━━━━━━━━━━━`, threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage(`${header}\nUnexpected error occurred while searching for an answer.\n━━━━━━━━━━━━━━━━`, threadID, messageID);
        }
    }
};