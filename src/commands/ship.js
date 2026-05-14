function calcScore(id1, id2) {
  const str = id1 + id2;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 101);
}

function getMessage(score) {
  if (score >= 90) return { msg: "AŞK MARŞI ÇALIN BUNLAR EVLENECEK", emoji: "💍✨" };
  if (score >= 75) return { msg: "vay bee bu olacak gibi", emoji: "💖💖💖" };
  if (score >= 60) return { msg: "fena değil be", emoji: "💕" };
  if (score >= 45) return { msg: "olabilir belki", emoji: "🤔" };
  if (score >= 30) return { msg: "hmm şansları var", emoji: "😐" };
  if (score >= 15) return { msg: "bu iş olmaz amk", emoji: "💀" };
  return { msg: "KEŞKE OLMASA", emoji: "🚫" };
}

module.exports = {
  name: "ship",
  aliases: ["!ship"],
  async execute(message) {
    const mentions = message.mentions.users;
    if (mentions.size < 2) {
      await message.reply("iki kişiyi etiketle: `!ship @kişi1 @kişi2`");
      return;
    }

    const [u1, u2] = [...mentions.values()];
    const score = calcScore(u1.id, u2.id);
    const { msg, emoji } = getMessage(score);

    const hearts = Math.floor(score / 10);
    const heartBar = "💖".repeat(hearts) + "🤍".repeat(10 - hearts);

    const n1 = u1.displayName || u1.username;
    const n2 = u2.displayName || u2.username;
    const shipName = n1.slice(0, Math.ceil(n1.length / 2)) + n2.slice(Math.floor(n2.length / 2));

    await message.reply(
      `**💕 Ship 💕**\n\n${u1} 💗 ${u2}\n\n**Ship İsmi:** ${shipName}\n**Uyumluluk:** %${score}\n**Seviye:** ${heartBar}\n\n${msg} ${emoji}`
    );
  },
};
