const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/aptitude/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_arithmetic_data.json';

// Headers to mimic a real browser
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getCategoryLinks() {
    console.log("🔍 Fetching all sub-categories...");
    try {
        // Adding headers here is the key
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        // IndiaBIX often uses 'ul.list-unstyled' or similar for topic lists
        // We look for any link that points to an aptitude sub-topic
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            // This filter ensures we only get the actual topic links
            if (link && link.includes('/aptitude/') && !link.includes('questions-and-answers')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) {
                    categories.push(fullUrl);
                }
            }
        });

        console.log(`✅ Found ${categories.length} categories.`);
        return categories;
    } catch (err) {
        console.error("❌ Failed to get categories:", err.message);
        return [];
    }
}

async function scrapePage(url) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        $('.bix-div-container').each((i, el) => {
            const question = $(el).find('.bix-td-qtxt').text().trim();
            const options = [];
            $(el).find('.bix-td-option-val').each((j, opt) => {
                options.push($(opt).text().trim());
            });

            // Target the specific answer container
            const answer = $(el).find('.jq-hdnakanswer').text().trim();
            const explanation = $(el).find('.bix-ans-description').text().trim();

            if (question) {
                pageData.push({ question, options, answer, explanation });
            }
        });

        return pageData;
    } catch (err) {
        // If 404, we've reached the end of the category
        return null; 
    }
}

// ... rest of your runCrawler() function remains the same ...

async function runCrawler() {
    const categories = await getCategoryLinks();
    if (categories.length === 0) {
        console.log("⚠️ No categories found. Check the START_URL or selectors.");
        return;
    }

    let masterData = [];

    for (const catUrl of categories) {
        // Clean up URL to ensure it ends with a slash for the suffix
        const cleanCatUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        const categoryName = cleanCatUrl.split('/').filter(Boolean).pop();
        
        console.log(`\n📂 Scraping Category: ${categoryName.toUpperCase()}`);

        for (let p = 1; p <= 20; p++) {
            const pageSuffix = p.toString().padStart(3, '0');
            // IndiaBIX pathing: category + 001 + 001, 001 + 002...
            const targetUrl = `${cleanCatUrl}001${pageSuffix}`;
            
            console.log(`   📄 Reading page ${p}: ${targetUrl}`);
            const questions = await scrapePage(targetUrl);

            if (!questions || questions.length === 0) {
                break; 
            }

            const taggedQuestions = questions.map(q => ({ ...q, category: categoryName }));
            masterData = [...masterData, ...taggedQuestions];

            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
            await sleep(1500); 
        }
    }
    console.log(`\n🎉 Done! Total: ${masterData.length}`);
}

runCrawler();