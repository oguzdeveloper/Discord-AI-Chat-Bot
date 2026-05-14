const { Client } = require("@deksdeveloper/discord.js-self-bot");
const { token, STATUS_MESSAGES } = require("./config");
const { onMessageCreate: onMsg } = require("./handlers/messageCreate");
const { onMessageCreate: onReact } = require("./handlers/reactionHandler");

const client = new Client({ checkUpdate: false });

function setRandomStatus() {
  const s = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
  client.user.setActivity(s.name, { type: s.type });
}

client.once("ready", () => {
  console.log(`✅ Self-bot aktif: ${client.user.tag}`);
  setRandomStatus();
  setInterval(setRandomStatus, 10 * 60 * 1000);
});

client.on("messageCreate", onMsg);
client.on("messageCreate", onReact);

client.on("error", (err) => console.error("Discord client hatası:", err));

function start() {
  client.login(token);
}

module.exports = { start };
