const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/logical-reasoning/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_logical_reasoning.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getLogicalCategories() {
    console.log("🔍 Scanning for Logical Reasoning topics...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        // Targets all sub-links in the logical-reasoning section
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/logical-reasoning/') && !link.includes('questions-and-answers')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) {
                    categories.push(fullUrl);
                }
            }
        });

        console.log(`✅ Found ${categories.length} Logical Reasoning categories.`);
        return categories;
    } catch (err) {
        console.error("❌ Error fetching topics:", err.message);
        return [];
    }
}

async function scrapeLogicalPage(url, topic) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        $('.bix-div-container').each((i, el) => {
            const qBlock = $(el);
            
            // 1. Capture Logic Diagrams (Very common in Logical Reasoning)
            let logicImages = [];
            qBlock.find('img').each((j, img) => {
                let src = $(img).attr('src');
                if (src && !src.includes('icon')) {
                    logicImages.push(src.startsWith('http') ? src : BASE_URL + src);
                }
            });

            const questionText = qBlock.find('.bix-td-qtxt').text().trim();
            const options = qBlock.find('.bix-td-option-val').map((j, opt) => $(opt).text().trim()).get();
            const answer = qBlock.find('.jq-hdnakanswer').text().trim();
            const explanation = qBlock.find('.bix-ans-description').text().trim();

            if (questionText || logicImages.length > 0) {
                pageData.push({
                    topic: topic,
                    question: questionText,
                    images: [...new Set(logicImages)],
                    options: options,
                    answer: answer,
                    explanation: explanation
                });
            }
        });

        return pageData;
    } catch (err) {
        return null;
    }
}

async function run() {
    const categories = await getLogicalCategories();
    if (categories.length === 0) return;

    let masterLogicalData = [];

    for (const catUrl of categories) {
        const topicName = catUrl.split('/').filter(Boolean).pop();
        const cleanUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        
        console.log(`\n🧩 Scraping Logical: ${topicName.toUpperCase()}`);

        for (let p = 1; p <= 25; p++) {
            const pageId = p.toString().padStart(3, '0');
            const targetUrl = `${cleanUrl}001${pageId}`;
            
            const results = await scrapeLogicalPage(targetUrl, topicName);
            
            if (!results || results.length === 0) {
                // Try alternate page pattern (some logical topics use 011, 012 like DI)
                if (p === 1) {
                    console.log(`   Trying alternate pattern for ${topicName}...`);
                    const altResults = await scrapeLogicalPage(`${cleanUrl}011001`, topicName);
                    if (altResults) {
                        // This topic uses the DI-style indexing
                        // Note: If you find many of these, we can expand the loop logic
                        masterLogicalData = [...masterLogicalData, ...altResults];
                    }
                }
                break;
            }
            
            masterLogicalData = [...masterLogicalData, ...results];
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterLogicalData, null, 2));
            console.log(`   ✅ Page ${p} synced. Total: ${masterLogicalData.length}`);
            
            await sleep(2000); 
        }
    }
}

run();