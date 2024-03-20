const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    config: {
        name: "adduser",
        version: "1.4",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Add user to the group chat"
        },
        longDescription: {
            en: "Add user to box chat of you"
        },
        category: "members",
        guide: {
            en: "   {pn} [link profile | uid]"
        }
    },

    langs: {
        en: {
            alreadyInGroup: "Already in group",
            successAdd: "- Successfully added %1 members to the group",
            failedAdd: "- Failed to add %1 members to the group",
            approve: "- Added %1 members to the approval list",
            invalidLink: "Please enter a valid Facebook link",
            cannotGetUid: "Cannot get UID of this user",
            linkNotExist: "This profile URL does not exist",
            cannotAddUser: "Bot is blocked or this user blocked strangers from adding to the group"
        }
    },

    onStart: async function ({ message, api, event, args, threadsData, getLang }) {
        const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
        const botID = api.getCurrentUserID();

        const [success, waitApproval] = [{ type: "success", uids: [] }, { type: "waitApproval", uids: [] }];
        const failed = [];

        function checkErrorAndPush(messageError, item) {
            item = item.replace(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)/i, '');
            const findType = failed.find(error => error.type === messageError);
            findType ? findType.uids.push(item) : failed.push({ type: messageError, uids: [item] });
        }

        const regExMatchFB = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;

        for (const item of args) {
            let uid;

            if (!isNaN(item)) {
                uid = item;
            } else if (regExMatchFB.test(item)) {
                try {
                    uid = await findUid(item);
                } catch (err) {
                    if (err.name === "SlowDown" || err.name === "CannotGetData") {
                        await sleep(1000);
                    } else {
                        checkErrorAndPush(
                            err.name === "InvalidLink" ? getLang('invalidLink') :
                                err.name === "CannotGetData" ? getLang('cannotGetUid') :
                                    err.name === "LinkNotExist" ? getLang('linkNotExist') :
                                        err.message,
                            item
                        );
                    }
                    continue;
                }
            } else {
                continue;
            }

            if (members.some(m => m.userID === uid && m.inGroup)) {
                checkErrorAndPush(getLang("alreadyInGroup"), item);
            } else {
                try {
                    await api.addUserToGroup(uid, event.threadID);
                    if (approvalMode === true && !adminIDs.includes(botID)) {
                        waitApproval.uids.push(uid);
                    } else {
                        success.uids.push(uid);
                    }
                } catch (err) {
                    checkErrorAndPush(getLang("cannotAddUser"), item);
                }
            }
        }

        const lengthUserSuccess = success.uids.length;
        const lengthUserWaitApproval = waitApproval.uids.length;
        const lengthUserError = failed.length;

        let msg = "";
        if (lengthUserSuccess) msg += `${getLang("successAdd", lengthUserSuccess)}\n`;
        if (lengthUserWaitApproval) msg += `${getLang("approve", lengthUserWaitApproval)}\n`;
        if (lengthUserError) {
            msg += `${getLang("failedAdd", failed.reduce((a, b) => a + b.uids.length, 0))} ${failed.reduce((a, b) => a += `\n    + ${b.uids.join('\n       ')}: ${b.type}`, "")}`;
        }

        await message.reply(msg);
    }
};