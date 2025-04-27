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

    // Memória simples para evitar múltiplos scrapes
    let cachedMatches = null;
    let lastFetchTime = 0;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    bot.on("callback_query", async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        // Se o cache estiver vazio ou muito velho, busca novamente
        if (!cachedMatches || Date.now() - lastFetchTime > CACHE_DURATION) {
            cachedMatches = await getFuriaLastMatches();
            lastFetchTime = Date.now();
        }

        const matches = cachedMatches;

        if (!matches.length) {
            return bot.sendMessage(chatId, "⚠️ Nenhum jogo encontrado no momento.");
        }

        let message = '';

        switch (data) {
            case "jogos_recentes":
                message = formatMatches(matches, 5);
                break;

            case "ultimos_25":
                message = formatMatches(matches, 25);
                break;

            default:
                return; // Se não for um callback conhecido, não faz nada
        }

        bot.sendMessage(chatId, message);
    });
};

// Função para formatar os jogos
function formatMatches(matches, amount) {
    const limit = Math.min(amount, matches.length);
    let formatted = '';

    for (let i = 0; i < limit; i++) {
        formatted += `🏆 *Jogo ${i + 1}:*\n`;
        formatted += `*${matches[i].team1}* vs *${matches[i].team2}*\n`;
        formatted += `Placar: *${matches[i].score}*\n`;
        formatted += `Evento: *${matches[i].event}*\n\n`;
    }

    return formatted;
}
