function calcScore(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 20) + 10; // 10-30 cm
}

function getMessage(score) {
  if (score >= 28) return { msg: "GOD MODE AKTİF", emoji: "🔱" };
  if (score >= 24) return { msg: "iyi be", emoji: "💪" };
  if (score >= 20) return { msg: "fena değil", emoji: "👍" };
  if (score >= 16) return { msg: "ortalama", emoji: "😐" };
  if (score >= 12) return { msg: "küçümseme", emoji: "🙄" };
  return { msg: "havuç kadar", emoji: "🥕" };
}

module.exports = {
  name: "kaccm",
  aliases: ["!kaccm", "!kaçcm"],
  async execute(message) {
    const target = message.mentions.users.first() ?? message.author;
    const score = calcScore(target.id);
    const { msg, emoji } = getMessage(score);
    const bar = "█".repeat(Math.min(Math.floor(score / 3), 10));

    await message.reply(
      `**📏 Kaç CM 📏**\n\n${target} için:\n\n**Boyut:** ${score} cm\n**Seviye:** ${bar} (${score}/30)\n\n${msg} ${emoji}`
    );
  },
};
