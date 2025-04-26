const puppeteer = require('puppeteer');
const Match = require('../models/Match');
const Notice = require('../models/Notice');
const userAgent =  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"

async function getFuriaLastMatches() {
    const url = 'https://www.hltv.org/results?team=8297';

    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent(userAgent);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        // await page.waitForSelector('.result', { timeout: 10000 });

        const matchesData = await page.evaluate(() => {
            const matches = [];
            const elements = document.querySelectorAll('.result');

            elements.forEach((el) => {
                const team1 = el.querySelector('.team-cell .team')?.textContent.trim() || '';
                const team2 = el.querySelectorAll('.team-cell .team')?.[1]?.textContent.trim() || '';
                const scoreLost = el.querySelector('.score-lost')?.textContent.trim() || '';
                const scoreWon = el.querySelector('.score-won')?.textContent.trim() || '';
                const event = el.querySelector('.event-name')?.textContent.trim() || '';

                matches.push({
                    team1,
                    team2,
                    score: `${scoreLost} - ${scoreWon}`,
                    event
                });
            });

            return matches;
        });

        await browser.close();

        return matchesData.map(m => new Match(m.team1, m.team2, m.score, m.event));
    } catch (error) {
        console.error('Erro ao acessar resultados:', error.message);
        return [];
    }
}

async function getFuriaNews() {
    const url = "https://www.hltv.org/team/8297/furia#tab-newsBox";

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // await page.waitForSelector('.subTab-newsArticle', { timeout: 10000 });

    const newsData = await page.evaluate(() => {
        const news = [];
        const elements = document.querySelectorAll('.subTab-newsArticle');

        elements.forEach((el, index) => {
            if (index >= 10) return;

            const relativeLink = el.getAttribute('href') || '';
            const link = `https://www.hltv.org${relativeLink}`;
            const date = el.querySelector('.subTab-newsDate')?.textContent.trim() || '';
            const fullText = el.textContent.trim();
            const title = fullText.replace(date, '').trim();

            news.push({ link, date, title });
        });

        return news;
    });

    await browser.close();

    return newsData.map(n => new Notice(n.link, n.date, n.title));
}


module.exports = { getFuriaLastMatches, getFuriaNews };
