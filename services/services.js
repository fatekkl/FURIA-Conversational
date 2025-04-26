const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Match = require('../models/Match');
const Notice = require('../models/Notice');

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

        const matches = [];

        $('.result').each((_, el) => {
            const team1 = $(el).find('.team-cell .team').first().text().trim();
            const team2 = $(el).find('.team-cell .team').last().text().trim();
            const scoreLost = $(el).find('.score-lost').text().trim();
            const scoreWon = $(el).find('.score-won').text().trim();
            const score = `${scoreLost} - ${scoreWon}`;
            const event = $(el).find('.event-name').text().trim();

            matches.push(new Match(
                team1,
                team2,
                score,
                event
            )
            );
        });

        await browser.close();

        return matches;
    } catch (error) {
        console.error('Erro ao acessar resultados:', error.message);
        return [];
    }
}

async function getFuriaNews() {
    const url = "https://www.hltv.org/team/8297/furia#tab-newsBox";

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.subTab-newsArticle', { timeout: 10000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    const news = [];

    $('.subTab-newsArticle').each((index, el) => {
        if (index >= 10) return false;

        const relativeLink = $(el).attr('href');
        const link = `https://www.hltv.org${relativeLink}`;
        const date = $(el).find('.subTab-newsDate').text().trim();
        const fullText = $(el).text().trim();
        const title = fullText.replace(date, '').trim();


        news.push(new Notice(link, date, title));
    });

    await browser.close();

    return news;
}


module.exports = { getFuriaLastMatches, getFuriaNews };
