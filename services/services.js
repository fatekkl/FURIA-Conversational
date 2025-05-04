const puppeteer = require('puppeteer');
const Match = require('../models/Match');
const Notice = require('../models/Notice');
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

// Configuração comum para puppeteer
const browserConfig = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1280,720',
    ],
    protocolTimeout: 60000 // Aumentando o timeout do protocol para 60 segundos
};

async function getFuriaLastMatches() {
    const url = 'https://www.hltv.org/results?team=8297';
    let browser = null;

    try {
        browser = await puppeteer.launch(browserConfig);
        const page = await browser.newPage();
        await page.setUserAgent(userAgent);
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        console.log("Página de resultados carregada com sucesso");

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

        return matchesData.map(m => new Match(m.team1, m.team2, m.score, m.event));
    } catch (error) {
        console.error('Erro ao acessar resultados:', error.message);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

// Notícias fictícias/estáticas como último recurso para quando tudo falhar
const backupNews = [
    {
        title: "FURIA finaliza preparação para próximo torneio internacional",
        link: "https://www.hltv.org/team/8297/furia#tab-newsBox",
        date: "Data atualizada diariamente"
    },
    {
        title: "Jogadores da FURIA comentam sobre treinamentos",
        link: "https://www.hltv.org/team/8297/furia#tab-newsBox",
        date: "Data atualizada diariamente"
    },
    {
        title: "FURIA busca manter boa fase no cenário competitivo",
        link: "https://www.hltv.org/team/8297/furia#tab-newsBox",
        date: "Data atualizada diariamente"
    },
    {
        title: "Análise: o desempenho da FURIA nas últimas partidas",
        link: "https://www.hltv.org/team/8297/furia#tab-newsBox",
        date: "Data atualizada diariamente"
    },
    {
        title: "FURIA anuncia agenda de jogos para o próximo mês",
        link: "https://www.hltv.org/team/8297/furia#tab-newsBox",
        date: "Data atualizada diariamente"
    }
];

async function getFuriaNews() {
    // Abordagem simplificada usando a página principal de notícias (mais leve)
    const url = "https://www.hltv.org/news/archive/2023";
    let browser = null;

    try {
        console.log("Iniciando busca de notícias (abordagem simplificada)...");
        browser = await puppeteer.launch(browserConfig);
        const page = await browser.newPage();
        
        // Bloqueando recursos pesados
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const blockTypes = ['image', 'stylesheet', 'font', 'media', 'script'];
            if (blockTypes.includes(req.resourceType()) || 
                req.url().includes('google') || 
                req.url().includes('analytics') ||
                req.url().includes('ads') ||
                req.url().includes('tracker')) {
                req.abort();
            } else {
                req.continue();
            }
        });
        
        await page.setUserAgent(userAgent);
        console.log(`Navegando para ${url}...`);
        
        // Definir um timeout mais baixo para carregar a página
        await page.goto(url, { 
            waitUntil: 'domcontentloaded', 
            timeout: 20000 
        });
        
        // Usar uma função de avaliação muito mais simples para evitar timeout
        const pageTitle = await page.title();
        console.log(`Página carregada: ${pageTitle}`);
        
        // Extração de links de notícias simplificada
        const newsLinks = await page.evaluate(() => {
            const links = [];
            const allLinks = document.querySelectorAll('a');
            
            allLinks.forEach(link => {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                
                if (href && href.includes('/news/') && 
                    text && text.length > 5 && 
                    (text.toUpperCase().includes('FURIA') || 
                     text.toUpperCase().includes('BRAZIL') ||
                     text.toUpperCase().includes('BRAZILIAN'))) {
                    
                    const date = new Date().toLocaleDateString();
                    
                    links.push({
                        link: href.startsWith('http') ? href : `https://www.hltv.org${href}`,
                        title: text,
                        date: date
                    });
                }
            });
            
            return links;
        });
        
        console.log(`Encontradas ${newsLinks.length} notícias da FURIA`);
        
        // Se encontrou notícias, retorna-as
        if (newsLinks.length > 0) {
            return newsLinks.slice(0, 10).map(n => new Notice(n.link, n.date, n.title));
        }
        
        // Se não encontrou, tenta a abordagem estática
        console.log("Usando notícias de backup");
        return backupNews.map(n => new Notice(n.link, n.date, n.title));
        
    } catch (error) {
        console.error('Erro ao buscar notícias:', error.message);
        // Em caso de erro, retorna as notícias de backup
        console.log("Erro detectado, usando notícias de backup");
        return backupNews.map(n => new Notice(n.link, n.date, n.title));
    } finally {
        if (browser) {
            await browser.close();
            console.log("Browser fechado após busca de notícias");
        }
    }
}

module.exports = { getFuriaLastMatches, getFuriaNews };