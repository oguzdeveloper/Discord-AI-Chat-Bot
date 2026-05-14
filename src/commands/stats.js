const { getStats } = require("../services/memory");

module.exports = {
  name: "stats",
  aliases: ["!stats"],
  async execute(message) {
    const { totalUsers, totalMessages } = getStats();
    await message.channel.send(`${totalUsers} kullanıcı ${totalMessages} mesaj`);
  },
};
