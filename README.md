# Discord AI Userbot

A self-hosted AI-powered Discord selfbot that generates human-like conversations and responses using OpenRouter/Fireworks AI.

## Features

- **AI-Powered Responses** - Generates natural, human-like replies using Fireworks AI
- **Smart Conversation Memory** - SQLite-based memory system for contextual responses
- **Auto Reactions** - Intelligent reaction system with customizable probability
- **Multiple Commands** - Built-in commands for stats, ship, reset, and more
- **Configurable Prefix** - Multiple prefix support for flexible usage
- **Random Responses** - Can respond to messages without explicit commands

## Tech Stack

- **Runtime:** Node.js
- **AI Provider:** OpenRouter / Fireworks AI
- **Database:** better-sqlite3 (SQLite)
- **Dependencies:** dotenv, node-fetch, debug

## Installation

1. Clone the repository:
```bash
git clone https://github.com/oguzdeveloper/Discord-AI-Chat-Bot.git
cd discord-ai-userbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DISCORD_TOKEN=your_self_bot_token
BOT_USER_ID=your_user_id
FIREWORK_KEYS=fw_your_api_key
AI_MODEL=accounts/fireworks/models/modelname
BOT_PREFIX=!,prefix,!prefix2
```

5. Run the bot:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord selfbot token | Required |
| `BOT_USER_ID` | Your Discord user ID | Required |
| `FIREWORK_KEYS` | Fireworks AI API key | Required |
| `AI_MODEL` | AI model to use | Required |
| `BOT_PREFIX` | Command prefixes (comma-separated) | `!` |
| `REACTION_CHANCE` | Probability of auto-reactions | `0.15` |
| `SELF_REACTION_CHANCE` | Probability of reacting to own messages | `0.50` |
| `RANDOM_RESPONSE_CHANCE` | Probability of passive responses | `0.08` |

## Project Structure

```
├── index.js              # Entry point
├── src/
│   ├── client.js         # Discord client setup
│   ├── config.js         # Configuration loader
│   ├── commands/         # Bot commands
│   │   ├── index.js
│   │   ├── kaccm.js
│   │   ├── reset.js
│   │   ├── ship.js
│   │   └── stats.js
│   ├── handlers/
│   │   ├── messageCreate.js
│   │   └── reactionHandler.js
│   └── services/
│       ├── ai.js         # AI integration
│       ├── memory.js     # Conversation memory
│       └── selam.js
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - See [LICENSE](LICENSE) for details.

---
<sub>Generated with ❤️ by <a href="https://github.com/oguzdeveloper/Repo-Scope">GitHub Repository Analyzer</a></sub>
