const Database = require("better-sqlite3");
const path     = require("path");
const fs       = require("fs");

// Veritabanı dosyası proje kökünde data/ klasöründe oluşur
const DB_DIR  = path.join(__dirname, "../../data");
const DB_PATH = path.join(DB_DIR, "memory.db");

// Klasör yoksa oluştur
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

// ─── Şema ─────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   TEXT    NOT NULL,
    role      TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
    content   TEXT    NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
`);

// ─── Hazır sorgular ───────────────────────────────────────────────────────────

const stmtInsert = db.prepare(
  "INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)"
);

const stmtGetHistory = db.prepare(
  `SELECT role, content
   FROM messages
   WHERE user_id = ?
   ORDER BY id DESC
   LIMIT 20`
);

const stmtDelete = db.prepare(
  "DELETE FROM messages WHERE user_id = ?"
);

const stmtTotalUsers = db.prepare(
  "SELECT COUNT(DISTINCT user_id) AS cnt FROM messages"
);

const stmtTotalMessages = db.prepare(
  "SELECT COUNT(*) AS cnt FROM messages"
);

// Fazla mesajları temizleyen statement (son 20'yi tut)
const stmtPrune = db.prepare(`
  DELETE FROM messages
  WHERE user_id = ?
    AND id NOT IN (
      SELECT id FROM messages
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 20
    )
`);

// ─── Public API ───────────────────────────────────────────────────────────────

function getHistory(userId) {
  // En yeni 20 mesajı alıp doğru kronolojik sıraya çeviriyoruz
  const rows = stmtGetHistory.all(userId);
  return rows.reverse().map(({ role, content }) => ({ role, content }));
}

function addToHistory(userId, role, content) {
  stmtInsert.run(userId, role, content);
  stmtPrune.run(userId, userId);
}

function clearHistory(userId) {
  stmtDelete.run(userId);
}

function getStats() {
  return {
    totalUsers:    stmtTotalUsers.get().cnt,
    totalMessages: stmtTotalMessages.get().cnt,
  };
}

module.exports = { getHistory, addToHistory, clearHistory, getStats };
