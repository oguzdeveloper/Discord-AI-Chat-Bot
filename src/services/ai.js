const { getHistory, addToHistory } = require("./memory");
const { AI_MODEL } = require("../config");

const SYSTEM_PROMPT = `
Adın Popo

SENİNLE KONUŞAN KİŞİ: {username}

KURALLAR
- köylü gibi konuş
- en fazla 5 kelime
- noktalama işareti kullanma
- emoji kullanma
- küçük harf kullan

DAVRANIŞ
- çok küfürbazsın, küfür etmekten kaçınmazsın
- yaratıcı küfürleri sever, sürekli küfür edersin

ÖNEMLİ
- oguz a asla laf yok
- oguz a laf eden olursa ona yüklen

ZORUNLU
- her cevap bu kurallara uyar
- asla açıklama yapmazsın
`.trim();

const ERROR_RESPONSES = [
  "lan bir şeyler ters gitti amk",
  "ya şu an olmadı bir dene bakalım",
  "bişey oldu yaa bi dakka",
  "hata verdi lan system bi dene",
];

class APIKeyManager {
  constructor(keys) {
    this.keys = keys.map((key, index) => ({
      key,
      index,
      exhausted: false,
      requestCount: 0,
      lastError: null,
    }));
  }

  getCurrentKey() {
    if (this.keys.every((k) => k.exhausted)) {
      console.log("Tüm API key'ler tükendi, sıfırlanıyor...");
      this.keys.forEach((k) => { k.exhausted = false; k.lastError = null; });
    }
    return this.keys.find((k) => !k.exhausted) ?? this.keys[0];
  }

  markExhausted(index, error) {
    const k = this.keys[index];
    if (!k) return;
    k.exhausted = true;
    k.lastError = error;
    console.log(`API Key #${index + 1} tüketildi: ${error}`);
  }

  markSuccess(index) {
    const k = this.keys[index];
    if (!k) return;
    k.requestCount++;
    k.exhausted = false;
    k.lastError = null;
  }

  getStatus() {
    return {
      totalKeys: this.keys.length,
      activeKeys: this.keys.filter((k) => !k.exhausted).length,
      keys: this.keys.map((k) => ({
        index: k.index + 1,
        exhausted: k.exhausted,
        requestCount: k.requestCount,
        lastError: k.lastError,
      })),
    };
  }
}

function loadAPIKeys() {
  const raw = process.env.FIREWORK_KEYS || process.env.LLMAPI_KEY || "";
  if (!raw) {
    console.error("FIREWORK_KEYS veya LLMAPI_KEY .env dosyasında tanımlı değil!");
    process.exit(1);
  }
  const keys = raw.split(",").map((k) => k.trim()).filter(Boolean);
  if (!keys.length) {
    console.error("Geçerli API key bulunamadı!");
    process.exit(1);
  }
  console.log(`${keys.length} API key yüklendi`);
  return keys;
}

const keyManager = new APIKeyManager(loadAPIKeys());

const SWITCH_ON_STATUS = new Set([401, 402, 403, 429]);

async function fetchCompletion(keyData, messages, systemPrompt) {
  return fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${keyData.key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 300,
      temperature: 0.95,
      top_p: 0.9,
      stream: false,
    }),
  });
}

async function getAIResponse(userId, userMessage, username) {
  addToHistory(userId, "user", userMessage);

  const messages = getHistory(userId).slice(-16);

  const systemPrompt = SYSTEM_PROMPT.replace("{username}", username);

  const maxAttempts = keyManager.keys.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const keyData = keyManager.getCurrentKey();

    try {
      const res = await fetchCompletion(keyData, messages, systemPrompt);

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (!reply) throw new Error("Boş cevap geldi");
        keyManager.markSuccess(keyData.index);
        addToHistory(userId, "assistant", reply);
        return reply;
      }

      const errText = await res.text();
      console.error(`Fireworks AI hatası (Key #${keyData.index + 1}):`, res.status, errText);

      if (SWITCH_ON_STATUS.has(res.status)) {
        keyManager.markExhausted(keyData.index, `HTTP ${res.status}`);
        continue;
      }
      throw new Error(`API error: ${res.status}`);
    } catch (err) {
      console.error(`AI hatası (Key #${keyData.index + 1}):`, err.message);
      if (err.message.includes("fetch") || err.message.includes("network")) {
        keyManager.markExhausted(keyData.index, err.message);
        continue;
      }
      break;
    }
  }

  console.error("Tüm API key'ler denendi, hiçbiri çalışmadı");
  return ERROR_RESPONSES[Math.floor(Math.random() * ERROR_RESPONSES.length)];
}

function getAPIStatus() {
  return keyManager.getStatus();
}

module.exports = { getAIResponse, getAPIStatus };
