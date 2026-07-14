# My-bot

Telegram-асистент **Алі** на базі Claude (Anthropic API).

## Запуск локально

1. Встановіть залежності:
   ```
   npm install
   ```
2. Скопіюйте `.env.example` у `.env` і заповніть значення:
   ```
   cp .env.example .env
   ```
   - `TG_TOKEN` — токен Telegram-бота від [@BotFather](https://t.me/BotFather)
   - `ANTHROPIC_API_KEY` — ключ Anthropic API з [console.anthropic.com](https://console.anthropic.com)
3. Запустіть бота:
   ```
   npm start
   ```

Команди бота: `/start` — привітання, `/reset` — очистити історію розмови.

`.env` не комітиться в репозиторій (див. `.gitignore`) — тримайте ключі лише на своїй машині/сервері.
