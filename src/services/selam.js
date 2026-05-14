const SELAM_TRIGGERS = [
  "sa", "sea", "slm", "s a", "s.a", "s.a.", "sa aleykum", "saas",
  "selam", "selams", "selam beyler", "selam kardeş", "selam reis",
  "selamun aleykum", "selamün aleyküm", "selamun aleyküm", "selam aleyküm",
  "selam aleküm", "selam alayküm", "selam aleykum", "selam aleykümselam",
  "sellam", "selaam", "selaamm", "slamm", "sllam", "selamm", "selm",
  "selaaaam", "selaaaamm", "sellaaam", "selaaaam aleykum",
  "aleykum", "aleyküm", "alykum", "alyküm", "alaykum", "alayküm",
  "es selamün aleyküm", "es selamun aleykum", "es selam aleyküm",
];

const SELAM_RESPONSES = [
  "aleyküm selam nöğürüyon la?",
  "ooo selammm",
  "selam reis",
  "hayırdır",
  "selam",
  "selam be",
  "ney la",
  "selamün aleyküm",
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function isSelamMessage(content) {
  const normalized = normalizeText(content);
  const firstWord = normalized.split(/\s+/)[0];
  return SELAM_TRIGGERS.some((t) => firstWord === normalizeText(t));
}

function getSelamResponse() {
  return SELAM_RESPONSES[Math.floor(Math.random() * SELAM_RESPONSES.length)];
}

module.exports = { isSelamMessage, getSelamResponse, normalizeText };
