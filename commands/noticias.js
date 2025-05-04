// commands/noticias.js
const { getFuriaNews } = require("../services/services");

module.exports = (bot) => {
    bot.onText(/\/noticias/, async (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, "🔎 Buscando últimas notícias da FURIA...");

        try {
            const news = await getFuriaNews();

            console.log("Noticias Obtidas: ", news)

            if (!news.length) {
                return bot.sendMessage(chatId, "⚠️ Nenhuma notícia encontrada no momento.");
            }

            const message = formatNews(news, 10); // Mostra no máximo 10 notícias

            bot.sendMessage(chatId, message, { parse_mode: "Markdown", disable_web_page_preview: true });
        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
            bot.sendMessage(chatId, "❌ Erro ao buscar notícias. Tente novamente mais tarde.");
        }
    });
};

// Função para formatar as notícias
function formatNews(news, amount) {
    const limit = Math.min(amount, news.length);
    let formatted = "📰 *Últimas notícias da FURIA:*\n\n";

    for (let i = 0; i < limit; i++) {
        formatted += `*${i + 1}.* [${news[i].title}](${news[i].link})\n`;
        formatted += `🗓️ _${news[i].date}_\n\n`;
    }

    return formatted;
}
