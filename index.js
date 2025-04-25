require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getFuriaLastMatches } = require('./services/services');


const bot_token = process.env.BOT_TOKEN;
const bot = new TelegramBot(bot_token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🐆 Bem-vindo ao FURIA Bot!\nUse /menu para ver o que posso fazer!");
});

bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `
🔥 Comandos disponíveis:
/jogos - Ver os ultimos jogos
/noticias - Últimas da FURIA
/quiz - Teste seus conhecimentos
  `);
});

bot.onText(/\/jogos/, (msg) => {
    const chatId = msg.chat.id

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Jogos Recentes", callback_data: "jogos_recentes" },
                    { text: "Calendário Completo", callback_data: "calendario_completo" }
                ]
            ]
        }
    }

    bot.sendMessage(chatId, "🎮 O que você quer saber?", options);
})


bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id
    const data = callbackQuery.data
    const matches = await getFuriaLastMatches()


    switch (data) {
        case "jogos_recentes":
            let recentMessage = '';

            for (let i = 0; i < 5; i++) {
                recentMessage += `🏆 Jogo ${i + 1}:\n`;
                recentMessage += `${matches[i].team1} vs ${matches[i].team2}\n`;
                recentMessage += `Placar: ${matches[i].score}\n`;
                recentMessage += `Evento: ${matches[i].event}\n\n`;
            }

            bot.sendMessage(chatId, recentMessage)
            break;
        case "calendario_completo":
            let completeMessage = ''

            for (let i = 0; i < 25; i++) {
                completeMessage += `🏆 Jogo ${i + 1}:\n`;
                completeMessage += `${matches[i].team1} vs ${matches[i].team2}\n`;
                completeMessage += `Placar: ${matches[i].score}\n`;
                completeMessage += `Evento: ${matches[i].event}\n\n`;
            }
            bot.sendMessage(chatId, completeMessage)
            break;

        default:
            break;
    }
});
