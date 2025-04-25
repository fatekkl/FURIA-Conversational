const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function getFuriaLastMatches() {
    const url = 'https://www.hltv.org/results?team=8297';

    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.result', { timeout: 10000 });

        const html = await page.content();
        const $ = cheerio.load(html);

        const matches  = [];

        $('.result').each((_, el) => {
            const team1 = $(el).find('.team-cell .team').first().text().trim();
            const team2 = $(el).find('.team-cell .team').last().text().trim();
            const scoreLost = $(el).find('.score-lost').text().trim();
            const scoreWon = $(el).find('.score-won').text().trim();
            const score = `${scoreLost} - ${scoreWon}`;
            const event = $(el).find('.event-name').text().trim();

            matches.push({
                team1,
                team2,
                score,
                event
            });
        });

        await browser.close();

        return matches;
    } catch (error) {
        console.error('Erro ao acessar resultados:', error.message);
        return [];
    }
}

module.exports = { getFuriaLastMatches };
