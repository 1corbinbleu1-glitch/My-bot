import "dotenv/config";
import { Bot } from "grammy";
import Anthropic from "@anthropic-ai/sdk";

const TG_TOKEN = process.env.TG_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!TG_TOKEN) throw new Error("TG_TOKEN is not set in .env");
if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set in .env");

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const bot = new Bot(TG_TOKEN);

const SYSTEM_PROMPT =
  "Ти — Алі, дружній та лаконічний асистент у Telegram. Відповідай українською, якщо користувач не пише іншою мовою.";

const MAX_HISTORY = 20;
const histories = new Map();

function getHistory(chatId) {
  if (!histories.has(chatId)) histories.set(chatId, []);
  return histories.get(chatId);
}

bot.command("start", (ctx) =>
  ctx.reply("Привіт! Я Алі, твій асистент. Постав запитання — і я відповім.")
);

bot.command("reset", (ctx) => {
  histories.delete(ctx.chat.id);
  return ctx.reply("Історію розмови очищено.");
});

bot.on("message:text", async (ctx) => {
  const chatId = ctx.chat.id;
  const history = getHistory(chatId);

  history.push({ role: "user", content: ctx.message.text });
  await ctx.replyWithChatAction("typing");

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    history.push({ role: "assistant", content: reply });
    while (history.length > MAX_HISTORY) history.shift();

    await ctx.reply(reply);
  } catch (err) {
    history.pop();
    console.error("Anthropic API error:", err);
    await ctx.reply("Вибач, сталася помилка при зверненні до Claude. Спробуй ще раз.");
  }
});

bot.start();
console.log("Алі запущений і слухає повідомлення...");
