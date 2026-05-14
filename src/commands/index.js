const fs = require("fs");
const path = require("path");

function loadCommands() {
  const commands = new Map();
  const dir = path.join(__dirname);

  for (const file of fs.readdirSync(dir)) {
    if (file === "index.js" || !file.endsWith(".js")) continue;

    const cmd = require(path.join(dir, file));

    if (!cmd.name || !cmd.aliases || !cmd.execute) {
      console.warn(`[COMMANDS] ${file} geçersiz format, atlandı.`);
      continue;
    }

    for (const alias of cmd.aliases) {
      commands.set(alias.toLowerCase(), cmd);
    }
  }

  console.log(`[COMMANDS] ${commands.size} alias yüklendi (${[...new Set(commands.values())].length} komut)`);
  return commands;
}

module.exports = loadCommands();
