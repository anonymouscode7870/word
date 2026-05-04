const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/logical-reasoning/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_logical_full_reasoning.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getCategoryLinks() {
    console.log("🔍 Fetching Logical Reasoning topics...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/logical-reasoning/') && !link.includes('questions-and-answers')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) categories.push(fullUrl);
            }
        });

        console.log(`✅ Found ${categories.length} topics.`);
        return categories;
    } catch (err) {
        return [];
    }
}

async function scrapePage(url, categoryName) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        $('.bix-div-container').each((i, el) => {
            const $container = $(el);
            
            // --- DIRECTION LOGIC ---
            // Captures the critical "Give answer (A) if..." block
            const direction = $container.prevAll('.bix-div-direction').first().find('.bix-td-direction').text().trim() 
                             || $container.closest('.bix-div-direction').find('.bix-td-direction').text().trim();

            const questionText = $container.find('.bix-td-qtxt').text().trim();
            
            const options = [];
            $container.find('.bix-td-option-val').each((j, opt) => {
                options.push($(opt).text().trim());
            });

            // --- IMAGE LOGIC ---
            // Captures Venn diagrams or logic symbols if present
            let images = [];
            $container.find('img').each((j, img) => {
                const src = $(img).attr('src');
                if (src && !src.includes('icon')) {
                    images.push(src.startsWith('http') ? src : BASE_URL + src);
                }
            });

            // --- ANSWER LOGIC ---
            let rawAnswer = $container.find('.jq-hdnakanswer').text().trim();
            if (!rawAnswer) {
                rawAnswer = $container.find('input[type="hidden"]').val() || "";
            }
            const cleanAnswer = rawAnswer.replace(/Option\s+/i, '').trim().charAt(0).toUpperCase();

            const explanation = $container.find('.bix-ans-description').text().trim();

            if (questionText && cleanAnswer) {
                pageData.push({
                    category: categoryName,
                    direction: direction || "Choose the correct alternative.",
                    question: questionText,
                    options: options,
                    answer: cleanAnswer,
                    explanation: explanation,
                    images: images
                });
            }
        });

        return pageData;
    } catch (err) {
        return null; 
    }
}

async function runCrawler() {
    const categories = await getCategoryLinks();
    if (categories.length === 0) return;

    let masterData = [];

    for (const catUrl of categories) {
        const categoryName = catUrl.split('/').filter(Boolean).pop();
        console.log(`\n🧩 Scraping Logical: ${categoryName.toUpperCase()}`);

        for (let p = 1; p <= 20; p++) {
            const pageSuffix = p.toString().padStart(3, '0');
            // Try standard pattern
            const targetUrl = `${catUrl.endsWith('/') ? catUrl : catUrl + '/'}001${pageSuffix}`;
            
            console.log(`   📄 Reading page ${p}`);
            const questions = await scrapePage(targetUrl, categoryName);

            if (!questions || questions.length === 0) break;

            masterData = [...masterData, ...questions];
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
            await sleep(2000); 
        }
    }
    console.log(`\n🎉 Success! Collected ${masterData.length} Logical questions.`);
}

runCrawler();