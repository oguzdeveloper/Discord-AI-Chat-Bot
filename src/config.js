require("dotenv").config();

// ─── Token ────────────────────────────────────────────────────────────────────
const token = process.env.DISCORD_TOKEN;
if (!token || token === "USER_TOKEN_BURAYA") {
  console.error("❌ DISCORD_TOKEN .env dosyasında tanımlı değil!");
  process.exit(1);
}

// ─── Bot kimliği ──────────────────────────────────────────────────────────────
const BOT_USER_ID = process.env.BOT_USER_ID || "1074289753484185600";

// ─── Prefix'ler ───────────────────────────────────────────────────────────────
const BOT_PREFIXES = process.env.BOT_PREFIX
  ? process.env.BOT_PREFIX.split(",").map((p) => p.trim())
  : [];


// ─── Şanslar ──────────────────────────────────────────────────────────────────
const REACTION_CHANCE = parseFloat(process.env.REACTION_CHANCE || "0.15");
const SELF_REACTION_CHANCE = parseFloat(process.env.SELF_REACTION_CHANCE || "0.25");
const RANDOM_RESPONSE_CHANCE = parseFloat(process.env.RANDOM_RESPONSE_CHANCE || "0.08");

// ─── AI ───────────────────────────────────────────────────────────────────────
const AI_MODEL = process.env.AI_MODEL || "accounts/fireworks/models/llama-v3p1-70b-instruct";

// ─── Durum mesajları ──────────────────────────────────────────────────────────
const STATUS_MESSAGES = [
  { name: "oguzdeveloper", type: 0 },
  { name: "discord.gg/kittycode", type: 0 },
  { name: "github.com/oguzdeveloper", type: 0 },
];

module.exports = {
  token,
  BOT_USER_ID,
  BOT_PREFIXES,
  REACTION_CHANCE,
  SELF_REACTION_CHANCE,
  RANDOM_RESPONSE_CHANCE,
  AI_MODEL,
  STATUS_MESSAGES,
};
