const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/aptitude/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_arithmetic_full.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all sub-category links from the main Aptitude page
 */
async function getCategoryLinks() {
    console.log("🔍 Fetching Aptitude sub-categories...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        $('a').each((i, el) => {
            const link = $(el).attr('href');
            // Filter for actual aptitude topics
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

/**
 * Scrapes a single page and handles hidden answer retrieval
 */
async function scrapePage(url, categoryName) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        $('.bix-div-container').each((i, el) => {
            const $container = $(el);
            
            const questionText = $container.find('.bix-td-qtxt').text().trim();
            
            const options = [];
            $container.find('.bix-td-option-val').each((j, opt) => {
                options.push($(opt).text().trim());
            });

            // --- REFINED ANSWER LOGIC ---
            // 1. Try common hidden class
            let rawAnswer = $container.find('.jq-hdnakanswer').text().trim();
            
            // 2. Fallback: Search for hidden input fields if class is empty
            if (!rawAnswer) {
                rawAnswer = $container.find('input[type="hidden"]').val() || "";
            }

            // 3. Clean the answer (e.g., "Option C" -> "C")
            // This regex removes "Option", spaces, and takes the first letter
            const cleanAnswer = rawAnswer.replace(/Option\s+/i, '').trim().charAt(0).toUpperCase();

            const explanation = $container.find('.bix-ans-description').text().trim();

            if (questionText && cleanAnswer) {
                pageData.push({
                    category: categoryName,
                    question: questionText,
                    options: options,
                    answer: cleanAnswer,
                    explanation: explanation,
                    source: url
                });
            }
        });

        return pageData;
    } catch (err) {
        return null; // Page likely doesn't exist
    }
}

/**
 * Main Controller
 */
async function runCrawler() {
    const categories = await getCategoryLinks();
    if (categories.length === 0) return;

    let masterData = [];

    for (const catUrl of categories) {
        const cleanCatUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        const categoryName = cleanCatUrl.split('/').filter(Boolean).pop();
        
        console.log(`\n📂 Scraping: ${categoryName.toUpperCase()}`);

        // Scrape first 20 pages per topic
        for (let p = 1; p <= 20; p++) {
            const pageSuffix = p.toString().padStart(3, '0');
            const targetUrl = `${cleanCatUrl}001${pageSuffix}`;
            
            console.log(`   📄 Reading page ${p}: ${targetUrl}`);
            const questions = await scrapePage(targetUrl, categoryName);

            if (!questions || questions.length === 0) {
                console.log(`   ⏹️ Reached end of ${categoryName}`);
                break; 
            }

            masterData = [...masterData, ...questions];

            // Real-time save
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
            
            // Critical delay to avoid IP blocking
            await sleep(2000); 
        }
    }
    console.log(`\n🎉 Process Complete! Total questions collected: ${masterData.length}`);
}

runCrawler();