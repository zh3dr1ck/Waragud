const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACCBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACDJn3QvMvjPnQATIaf70mQmTRpD1jnY7YcUoDm18y1ValzMgFtv84VGw9+zS2aFyhT12dc0/c14QZsSd+wUeVrBxfZFSS+2QOTAqjZqAw1Ri7uFSYZ3kT8xpn0GAJBx/zgGjw5ifqrOsYDpKMXNcrxZujysn3+6cn86ElPYrYDPJSDM/xYnZWgyqT2SCmrnDlHYMHBLfqwF6zXE0Ud00aNLI8im3XScz2OtcrVzUlUFDTfa8uWb6QWR8D0V3jaeUg+6y5VJBLLryZmzCRAVjV7HH/M88jG7MBSZ/lCYKmWAHPbyJXwZ8TtLJvuhLDGbRv9PwA+8JKmCSwXsDPNqa5xWt8t+3yU2cJ0QuNZcBK3j2oyHTzUO+i46BOL8vnc39HBUg+ipu5To4m6kgXVsr0cWt+2nq+GiT5hMnsm0XkXDqRvCtOs6Mk8idInvRbSrqgVT5G9/NbV2IJo/upvIYeKsZuTZlUslpoF14NJjHzuwlCauaJI67t6O+6/vpqhjAEJhaIxL3BX66VRByoRxr6LoV6bKUZxzvr9zzxMnlJyrInehWYScSYLdv6wviGx8nPlUp8GETehKe+g1NOR4QbXPnJ4FnGBnOGdxbQD/B0HO4cjkx2PJtAvl/9xZA+0fSCDAx/PUC6V/B2urYfWpOjfHg1XErlRKMLCVPS3DcaAcGHCiy4IZor8uB3lkA9Jav6N7HlSix9qzxq4+EtsJdxyX08kIkiYdCPo2d5n0w9i15b97ptbxZ46vx24q4ZGatA5jIO/3H5ye8tEp+ZJI34h3fqXdyccbVCbZNv/rBDjfYuTXoPoyMRb8458Nv4mE3gGsM1Mq2FT3f4LDeGiTccN9fdyA59AhqfydjhJFSEaxxjifO88gIRp1Uca+fVp+3blGfXciNVbHGKWehO6XCSmNtmjXDYE+SC9XXe20tQDAB/lQnN/jUy32tOhmqggzbrQLh8UmDVSCw0BV9hG8LKT/XZhT/RYKW86hXUeZ+3PJ3/LW7IoSNnuiailtq+cM7O9ZIITiCtYgmelLj3WdcRU4lzG1kwjtA+T/VRKGiOTczsOXpvC1RGl0MF+VCzFnDpvwhLvSpCnNQ7NWuxOATlXg8+Eqa/vbLHoDlD7dEuHmlbjOlVHmizLBFtjgqP2I1ERDqzJHG53zVqUVnsp0qcdxV1X6gBWU9gi67CrDaPbdc8cFUTyYc5CmYkZQb/J/Ta+UT60p8R2MMsGkNz3ghdZMfMwnBRkgYFiZ2evlZSoCxl8aP/2fZ9c5YguC81OgsQxtWBBRTaHu0c/bPWxWcRogQuSMJ5yC+UOAe8iXNnqgEWQwyeryehenUHEg24WRUrqqoTyIK/ZOEvSuevnICgPgBonaMSbKDM+V4YqXrNAxIWxK7Creus56GRmk/zImGaeJSOOTG9RtmfBq5G+DXABw2VQOOiCAoiq7G7qQvZa5qMJRPfRu8VJIJ4hQAJ3KmN3BTZOw25cf2+xiduPrVIRY=";
const _U = "151APXZc-p_34dLclwdyPCofmXEQl-UcbiDZEGnpEdrhPBgGI-Te8KoDVUQdf4YEkxUmwp_FmkUndrbbGHvAFbQNt7kWCYqBrsbQi8BKJaXDllgUxMGhqaAKpDVZjJ9OxvxKASSO0LwWnj-iQwzys_dIJHIIHUgp2YLoC1O6FZWGBo_lanXb03sm9B1qFnlt9D88R3POvMtqTMgXygZXGMn3ybtXKsFMthGYQnGXNLa4";

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    description: { en: "bing dalle3 image generator" },
    category: "image",
    guide: { en: "{prefix}dalle <prompt>" }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    try {
      api.setMessageReaction("🕰️", event.messageID, () => { }, true);

      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);
        return;
      }

      const imgData = [];

      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => { }, true);
      message.reply(`An error occurred: ${error}`, event.threadID, event.messageID);
    }
  }
};