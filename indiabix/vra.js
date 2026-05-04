const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/verbal-ability/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_verbal_full_data.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all Verbal Ability sub-category links
 */
async function getCategoryLinks() {
    console.log("🔍 Fetching Verbal Ability topics...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/verbal-ability/') && !link.includes('questions-and-answers')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) {
                    categories.push(fullUrl);
                }
            }
        });

        console.log(`✅ Found ${categories.length} topics.`);
        return categories;
    } catch (err) {
        console.error("❌ Failed to get categories:", err.message);
        return [];
    }
}

/**
 * Scrapes a Verbal page with Direction and Answer logic
 */
async function scrapePage(url, categoryName) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        $('.bix-div-container').each((i, el) => {
            const $container = $(el);
            
            // 1. Capture the Direction/Instruction text
            // In Verbal, this is often in a preceding div with class 'bix-td-direction'
            const direction = $container.prevAll('.bix-div-direction').first().find('.bix-td-direction').text().trim() 
                             || $container.closest('.bix-div-direction').find('.bix-td-direction').text().trim();

            const questionText = $container.find('.bix-td-qtxt').text().trim();
            
            const options = [];
            $container.find('.bix-td-option-val').each((j, opt) => {
                options.push($(opt).text().trim());
            });

            // 2. Answer logic (Alphabet retrieval)
            let rawAnswer = $container.find('.jq-hdnakanswer').text().trim();
            if (!rawAnswer) {
                rawAnswer = $container.find('input[type="hidden"]').val() || "";
            }

            const cleanAnswer = rawAnswer.replace(/Option\s+/i, '').trim().charAt(0).toUpperCase();
            const explanation = $container.find('.bix-ans-description').text().trim();

            if (questionText && cleanAnswer) {
                pageData.push({
                    category: categoryName,
                    direction: direction || "Follow instructions",
                    question: questionText,
                    options: options,
                    answer: cleanAnswer,
                    explanation: explanation
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
        const cleanCatUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        const categoryName = cleanCatUrl.split('/').filter(Boolean).pop();
        
        console.log(`\n📂 Scraping Verbal: ${categoryName.toUpperCase()}`);

        // Verbal sections can be large; scanning up to 25 pages
        for (let p = 1; p <= 25; p++) {
            const pageSuffix = p.toString().padStart(3, '0');
            const targetUrl = `${cleanCatUrl}001${pageSuffix}`;
            
            console.log(`   📄 Reading page ${p}: ${targetUrl}`);
            const questions = await scrapePage(targetUrl, categoryName);

            if (!questions || questions.length === 0) break;

            masterData = [...masterData, ...questions];
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
            
            await sleep(2000); 
        }
    }
    console.log(`\n🎉 Success! Collected ${masterData.length} Verbal questions.`);
}

runCrawler();