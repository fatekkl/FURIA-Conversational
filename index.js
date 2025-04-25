require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🐆 Bem-vindo ao FURIA Bot!\nUse /menu para ver o que posso fazer!");
});

bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `
🔥 Comandos disponíveis:
/jogos - Ver próximos jogos
/noticias - Últimas da FURIA
/quiz - Teste seus conhecimentos
  `);
});
