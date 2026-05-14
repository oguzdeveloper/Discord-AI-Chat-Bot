const commands = require("../commands");
const { getAIResponse } = require("../services/ai");
const { isSelamMessage, getSelamResponse } = require("../services/selam");
const { BOT_USER_ID, BOT_PREFIXES, RANDOM_RESPONSE_CHANCE } = require("../config");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cooldowns = new Set();

async function isReplyToBot(message, botId) {
  if (!message.reference?.messageId) return false;
  try {
    const ref = await message.channel.messages.fetch(message.reference.messageId);
    return ref?.author.id === botId;
  } catch {
    return false;
  }
}

async function handleCommand(message) {
  const lower = message.content.trim().toLowerCase();

  if (!lower.startsWith("!")) return false;

  const trigger = lower.split(/\s+/)[0];
  const cmd = commands.get(trigger);
  if (!cmd) return false;

  await cmd.execute(message);
  return true;
}

async function onMessageCreate(message) {
  const { author, content: raw } = message;

  if (!message.client.user) return;
  if (author.id === message.client.user.id) return;
  if (author.bot) return;

  const content = raw.trim();
  if (!content) return;

  if (await handleCommand(message)) return;

  if (isSelamMessage(content)) {
    await message.reply(getSelamResponse());
    return;
  }

  const botId = message.client.user.id;
  const hasPrefix = BOT_PREFIXES.some((p) => content.startsWith(p));
  const hasMention = message.mentions.has(BOT_USER_ID);
  const hasReply = await isReplyToBot(message, botId);
  const isDirectMessage = !message.guild;
  const isTriggered = hasPrefix || hasMention || hasReply || isDirectMessage;
  const isRandom = !isTriggered && Math.random() < RANDOM_RESPONSE_CHANCE;

  if (!isTriggered && !isRandom) return;

  let clean = hasPrefix
    ? content.slice(BOT_PREFIXES.find((p) => content.startsWith(p)).length).trim()
    : content;
  if (hasMention) clean = clean.replace(/<@!?\d+>/g, "").trim();
  if (!clean) clean = "ne";

  const cdKey = `${author.id}-${message.channelId}`;
  if (cooldowns.has(cdKey)) return;
  cooldowns.add(cdKey);

  try {
    await message.channel.sendTyping();
    await sleep(800 + Math.random() * 2200);

    const reply = await getAIResponse(author.id, clean, author.username);
    await message.reply(reply);

    const tag = isTriggered ? "TRIGGERED" : "RANDOM";
    console.log(`[${tag}] [${author.username}] ${clean}\n[SELF] ${reply}\n`);
  } catch (err) {
    console.error("Mesaj işlenirken hata:", err);
  } finally {
    setTimeout(() => cooldowns.delete(cdKey), 2000);
  }
}

module.exports = { onMessageCreate };
