// commands/jogos.js
const { getFuriaLastMatches } = require('../services/services');

module.exports = (bot) => {
    bot.onText(/\/jogos/, async (msg) => {
        const chatId = msg.chat.id;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Jogos Recentes", callback_data: "jogos_recentes" },
                        { text: "Últimos 25 jogos", callback_data: "ultimos_25" }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, "🎮 O que você quer saber?", options);
    });

    bot.on("callback_query", async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;
        const matches = await getFuriaLastMatches();

        switch (data) {
            case "jogos_recentes":
                let recentMessage = '';

                for (let i = 0; i < 5; i++) {
                    recentMessage += `🏆 Jogo ${i + 1}:\n`;
                    recentMessage += `${matches[i].team1} vs ${matches[i].team2}\n`;
                    recentMessage += `Placar: ${matches[i].score}\n`;
                    recentMessage += `Evento: ${matches[i].event}\n\n`;
                }
            
                bot.sendMessage(chatId, recentMessage);
                break;
            case "ultimos_25":
                let completeMessage = '';

                for (let i = 0; i < 25; i++) {
                    completeMessage += `🏆 Jogo ${i + 1}:\n`;
                    completeMessage += `${matches[i].team1} vs ${matches[i].team2}\n`;
                    completeMessage += `Placar: ${matches[i].score}\n`;
                    completeMessage += `Evento: ${matches[i].event}\n\n`;
                }
                bot.sendMessage(chatId, completeMessage);
                break;

            default:
                break;
        }
    });
};
