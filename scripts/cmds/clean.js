const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

module.exports = {
  config: {
    name: "clean",
    aliases: [],
    author: "kshitiz",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "clean cache"
    },
    longDescription: {
      en: "help to clean cache and tmp folder"
    },
    category: "members",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {
    const cacheFolderPath = path.join(__dirname, 'cache');
    const tmpFolderPath = path.join(__dirname, 'tmp');

    api.sendMessage({ body: 'Cleaning cache and tmp folders...', attachment: null }, event.threadID, async () => {
      const cleanFolder = async (folderPath) => {
        try {
          if (fs.existsSync(folderPath)) {
            const files = await fsPromises.readdir(folderPath);

            if (files.length > 0) {
              await Promise.all(files.map(async (file) => {
                const filePath = path.join(folderPath, file);
                await fsPromises.unlink(filePath);
                console.log(`File ${file} deleted successfully from ${folderPath}!`);
              }));

              console.log(`All files in the ${folderPath} folder deleted successfully!`);
            } else {
              console.log(`No files found in the ${folderPath} folder.`);
            }
          } else {
            console.log(`${folderPath} folder not found.`);
          }
        } catch (error) {
          console.error(`Error cleaning folder ${folderPath}: ${error.message}`);
        }
      };

      await cleanFolder(cacheFolderPath);
      await cleanFolder(tmpFolderPath);

      api.sendMessage({ body: 'Cache and tmp folders cleaned successfully!' }, event.threadID);
    });
  },
};