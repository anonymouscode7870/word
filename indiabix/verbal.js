const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/verbal-ability/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_verbal_ability.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getVerbalCategories() {
    console.log("🔍 Fetching all Verbal Ability sub-categories...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        // IndiaBIX Verbal section uses a list of links. 
        // We'll grab everything that points to /verbal-ability/ excluding the index itself.
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/verbal-ability/') && !link.includes('questions-and-answers')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) {
                    categories.push(fullUrl);
                }
            }
        });

        console.log(`✅ Found ${categories.length} Verbal topics.`);
        return categories;
    } catch (err) {
        console.error("❌ Failed to reach the Verbal Ability page:", err.message);
        return [];
    }
}

async function scrapeVerbalPage(url, topic) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageQuestions = [];

        $('.bix-div-container').each((i, el) => {
            const qBlock = $(el);
            
            const questionText = qBlock.find('.bix-td-qtxt').text().trim();
            const options = qBlock.find('.bix-td-option-val').map((j, opt) => $(opt).text().trim()).get();
            const answer = qBlock.find('.jq-hdnakanswer').text().trim();
            const explanation = qBlock.find('.bix-ans-description').text().trim();

            if (questionText) {
                pageQuestions.push({
                    topic: topic,
                    question: questionText,
                    options: options,
                    answer: answer,
                    explanation: explanation
                });
            }
        });

        return pageQuestions;
    } catch (err) {
        return null;
    }
}

async function run() {
    const categories = await getVerbalCategories();
    if (categories.length === 0) {
        console.log("⚠️ Still finding 0 categories. The site might be blocking the request or the selector is off.");
        return;
    }

    let masterVerbalData = [];

    for (const catUrl of categories) {
        // Clean URL to handle IndiaBIX's specific folder structure
        const topicName = catUrl.split('/').filter(Boolean).pop();
        const cleanUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        
        console.log(`\n📖 Scraping: ${topicName.toUpperCase()}`);

        // Verbal sections are huge (e.g. Synonyms has 10+ pages)
        for (let p = 1; p <= 30; p++) {
            const pageId = p.toString().padStart(3, '0');
            const targetUrl = `${cleanUrl}001${pageId}`;
            
            const results = await scrapeVerbalPage(targetUrl, topicName);
            
            if (!results || results.length === 0) {
                console.log(`   ⏹️ End of topic at page ${p}`);
                break;
            }
            
            masterVerbalData = [...masterVerbalData, ...results];
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterVerbalData, null, 2));
            console.log(`   ✅ Page ${p} synced. Total: ${masterVerbalData.length}`);
            
            await sleep(2000); 
        }
    }
}

run();