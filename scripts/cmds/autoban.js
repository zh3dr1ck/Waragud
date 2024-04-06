module.exports = {
    config: {
        name: "autoban",
        version: "1.0",
        author: "YourName",
        description: {
            en: "Automatically ban specified users by UID.",
            vi: "Tự động cấm người dùng đã được chỉ định bằng UID."
        },
        category: "admin",
        permissions: ["ADMINISTRATOR"]
    },

    async onStart({ usersData }) {
        const uidsToBan = ["100095051537555", "123456789012345"];
        const defaultReason = "didn't follow the rules";
        const time = new Date().toLocaleString(); // Get current date/time

        for (const uid of uidsToBan) {
            try {
                const userData = await usersData.get(uid);

                if (!userData) {
                    console.error(`User with UID ${uid} not found.`);
                    continue;
                }

                if (userData.banned && userData.banned.status) {
                    console.log(`User with UID ${uid} is already banned.`);
                    continue;
                }

                await usersData.set(uid, {
                    ...userData,
                    banned: {
                        status: true,
                        reason: defaultReason,
                        date: time
                    }
                });

                console.log(`User with UID ${uid} has been automatically banned.`);
            } catch (error) {
                console.error(`Error banning user with UID ${uid}: ${error.message}`);
            }
        }
    }
};