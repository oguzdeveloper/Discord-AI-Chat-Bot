const { clearHistory } = require("../services/memory");

module.exports = {
  name: "reset",
  aliases: ["!reset"],
  async execute(message) {
    clearHistory(message.author.id);
    await message.channel.send("tamam sildim hepsini");
  },
};
