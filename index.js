require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot_token = process.env.BOT_TOKEN;
const bot = new TelegramBot(bot_token, { polling: true });

// Importar e usar os comandos
const jogosCommand = require('./commands/jogos');
const quizCommand = require('./commands/quiz');
const noticiasCommand = require('./commands/noticias')

// Inicializar os comandos
jogosCommand(bot);
quizCommand(bot);
noticiasCommand(bot)

// Comando /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🐆 Bem-vindo ao FURIA Bot!\nUse /menu para ver o que posso fazer!");
});

// Comando /menu
bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `
🔥 Comandos disponíveis:
/jogos - Ver os ultimos jogos
/noticias - Últimas da FURIA
/quiz - Teste seus conhecimentos
  `);
});
