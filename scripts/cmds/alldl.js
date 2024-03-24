const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

function loadAutoLinkStates() {
    try {
        const data = fs.readFileSync("autolink.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

function saveAutoLinkStates(states) {
    fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
    threadStates: {},
    config: {
        name: 'alldl',
        version: '3.0',
        author: 'Vex_Kshitiz',
        countDown: 5,
        role: 0,
        shortDescription: 'Auto video downloader for Instagram, Facebook, TikTok, Twitter, Pinterest and youtube',
        longDescription: '',
        category: 'media',
        guide: {
            en: '{p}{n}',
        }
    },
    onStart: async function ({ api, event }) {
        const threadID = event.threadID;

        if (!this.threadStates[threadID]) {
            this.threadStates[threadID] = {};
        }
    },
    onChat: async function ({ api, event }) {
        const threadID = event.threadID;

        if (this.checkLink(event.body)) {
            const { url } = this.checkLink(event.body);
            console.log(`Requested download from URL: ${url}`);
            api.sendMessage("Request received. Processing download...", event.threadID, event.messageID);
            this.downLoad(url, api, event);
        }
    },
    downLoad: function (url, api, event) {
        // Implement the download functionality here based on the user's request
        // For example, you can call the appropriate download function based on the platform of the URL
    },
    checkLink: function (url) {
        if (
            url.includes("instagram") ||
            url.includes("facebook") ||
            url.includes("fb.watch") ||
            url.includes("tiktok") ||
            url.includes("x.com") ||
            url.includes("pin.it") ||
            url.includes("youtu")
        ) {
            return {
                url: url
            };
        }

        const fbWatchRegex = /fb\.watch\/[a-zA-Z0-9_-]+/i;
        if (fbWatchRegex.test(url)) {
            return {
                url: url
            };
        }

        return null;
    }
};

async function fbDownloader(url) {
    try {
        const response1 = await axios({
            method: 'POST',
            url: 'https://snapsave.app/action.php?lang=vn',
            headers: {
                "accept": "*/*",
                "accept-language": "vi,en-US;q=0.9,en;q=0.8",
                "content-type": "multipart/form-data",
                "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": "https://snapsave.app/vn",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            data: {
                url
            }
        });

        console.log('Facebook Downloader Response:', response1.data);

        let html;
        const evalCode = response1.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
        eval(evalCode);
        html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

        const $ = cheerio.load(html);
        const download = [];

        const tbody = $('table').find('tbody');
        const trs = tbody.find('tr');

        trs.each(function (i, elem) {
            const trElement = $(elem);
            const tds = trElement.children();
            const quality = $(tds[0]).text().trim();
            const url = $(tds[2]).children('a').attr('href');
            if (url != undefined) {
                download.push({
                    quality,
                    url
                });
            }
        });

        return {
            success: true,
            video_length: $("div.clearfix > p").text().trim(),
            download
        };
    } catch (err) {
        console.error('Error in Facebook Downloader:', err);
        return {
            success: false
        };
    }
}