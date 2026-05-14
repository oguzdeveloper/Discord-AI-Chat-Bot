const { BOT_PREFIXES, BOT_USER_ID, REACTION_CHANCE, SELF_REACTION_CHANCE } = require("../config");
const { isSelamMessage } = require("../services/selam");

const REACTIONS = ["😂", "🤣", "😆"];
const reacted = new Set();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


async function onSelfMessage(message) {
  if (!message.client.user) return;
  if (message.author.id !== message.client.user.id) return;
  if (reacted.has(message.id)) return;
  if (Math.random() > SELF_REACTION_CHANCE) return;

  await sleep(1000 + Math.random() * 2000);

  try {
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    await message.react(emoji);
    reacted.add(message.id);
    console.log(`[TEPKİ-SELF] ${emoji} → ${message.content.slice(0, 30)}`);
  } catch (err) {
    console.log(`[TEPKİ-SELF HATA] ${err.message}`);
  }
}

async function onOtherMessage(message) {
  if (!message.client.user) return;
  if (message.author.id === message.client.user.id) return;
  if (message.author.bot) return;

  const content = message.content.trim();
  if (!content) return;

  if (content.startsWith("!")) return;
  if (BOT_PREFIXES.some((p) => content.startsWith(p))) return;
  if (message.mentions.has(BOT_USER_ID)) return;
  if (message.reference?.messageId) return;
  if (isSelamMessage(content)) return;

  if (Math.random() > REACTION_CHANCE) return;
  if (reacted.has(message.id)) return;

  await sleep(500 + Math.random() * 1500);

  try {
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    await message.react(emoji);
    reacted.add(message.id);
    console.log(`[TEPKİ] ${emoji} → [${message.author.username}]: ${content.slice(0, 30)}`);
  } catch (err) {
    console.log(`[TEPKİ HATA] ${err.message}`);
  }
}

async function onMessageCreate(message) {
  await onSelfMessage(message);
  await onOtherMessage(message);
}

module.exports = { onMessageCreate };
