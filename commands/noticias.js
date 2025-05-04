const { getFuriaNews } = require("../services/services");

module.exports = (bot) => {
    let cachedNews = null;
    let lastFetchTime = 0;
    const CACHE_DURATION = 30 * 60 * 1000;
    
    let requestInProgress = false;

    bot.onText(/\/noticias/, async (msg) => {
        const chatId = msg.chat.id;
        
        if (requestInProgress) {
            return bot.sendMessage(chatId, "⌛ Uma busca por notícias já está em andamento. Por favor, aguarde...");
        }
        
        if (cachedNews && Date.now() - lastFetchTime < CACHE_DURATION) {
            console.log("Usando cache de notícias");
            const message = formatNews(cachedNews, 10);
            return bot.sendMessage(chatId, message, { 
                parse_mode: "Markdown", 
                disable_web_page_preview: true 
            });
        }
        
        requestInProgress = true;
        
        const messageText = "🔎 Buscando notícias da FURIA...\nIsso pode levar até 30 segundos.";
        bot.sendMessage(chatId, messageText)
            .then(async (sentMessage) => {
                try {
                    console.log("Iniciando busca de notícias...");
                    
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error("Timeout ao buscar notícias")), 30000);
                    });
                    
                    const news = await Promise.race([
                        getFuriaNews(),
                        timeoutPromise
                    ]);
                    
                    console.log(`Notícias obtidas: ${news.length}`);
                    
                    cachedNews = news;
                    lastFetchTime = Date.now();
                    
                    const message = formatNews(news, 10);
                    bot.sendMessage(chatId, message, { 
                        parse_mode: "Markdown", 
                        disable_web_page_preview: true 
                    });
                    
                } catch (error) {
                    console.error("Erro ao buscar notícias:", error);
                    bot.sendMessage(
                        chatId,
                        "❌ Ocorreu um erro ao buscar as notícias. Tente novamente mais tarde."
                    );
                } finally {
                    requestInProgress = false;
                }
            })
            .catch(err => {
                console.error("Erro ao enviar mensagem inicial:", err);
                requestInProgress = false;
            });
    });
};

function formatNews(news, amount) {
    if (!news || news.length === 0) {
        return "⚠️ Nenhuma notícia encontrada no momento.";
    }
    
    const limit = Math.min(amount, news.length);
    let formatted = "📰 *Últimas notícias da FURIA:*\n\n";

    for (let i = 0; i < limit; i++) {
        formatted += `*${i + 1}.* [${news[i].title}](${news[i].link})\n`;
        formatted += `🗓️ _${news[i].date}_\n\n`;
    }

    return formatted;
}