const { getFuriaNews } = require("../services/services");

module.exports = (bot) => {
    bot.onText(/\/noticias/, async (msg) => {
        const chatId = msg.chat.id;
        const news = await getFuriaNews();

        let message = "📰 Últimas notícias da FURIA:\n\n";

        news.forEach((notice, index) => {
            message += `*${index + 1}.* [${notice.title}](${notice.link}) - _${notice.date}_\n\n`;
        });

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    });
}
