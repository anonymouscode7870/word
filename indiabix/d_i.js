const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/data-interpretation/questions-and-answers/`;
const OUTPUT_FILE = 'indiabix_di_final_database.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getDICategories() {
    console.log("🔍 Scanning DI Categories...");
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        $('.div-topics-index a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/data-interpretation/')) {
                const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
                if (!categories.includes(fullUrl)) categories.push(fullUrl);
            }
        });
        return categories;
    } catch (err) {
        console.error("Error fetching categories:", err.message);
        return [];
    }
}

async function scrapeDIPage(url, categoryName) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const pageData = [];

        // 1. EXTRACTION: Directions (The context/rules)
        const directions = $('.bix-td-direction').text().trim();

        // 2. EXTRACTION: The Table Tag (Preserving structure for DI)
        let tableHtml = null;
        const $table = $('.bix-div-direction table, .bix-tbl-container table').first();
        if ($table.length) {
            // We keep the internal HTML to preserve colspans for "New/Left" columns
            tableHtml = `<table border="1" class="di-table">${$table.html()}</table>`;
        }

        // 3. EXTRACTION: Images (Bar/Pie/Line charts)
        let images = [];
        $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && (src.includes('/images/data-interpretation/') || src.includes('/_files/'))) {
                images.push(src.startsWith('http') ? src : BASE_URL + src);
            }
        });

        // 4. EXTRACTION: Questions on this page
        $('.bix-div-container').each((i, el) => {
            const $q = $(el);
            
            // Handle Hidden Answer (Alphabet)
            let rawAns = $q.find('.jq-hdnakanswer').text().trim() || $q.find('input[type="hidden"]').val() || "";
            const cleanAns = rawAns.replace(/Option\s+/i, '').trim().charAt(0).toUpperCase();

            const questionText = $q.find('.bix-td-qtxt').text().trim();
            const options = $q.find('.bix-td-option-val').map((j, opt) => $(opt).text().trim()).get();
            const explanation = $q.find('.bix-ans-description').text().trim();

            if (questionText && cleanAns) {
                pageData.push({
                    category: categoryName,
                    directions: directions,
                    tableHtml: tableHtml,
                    images: [...new Set(images)],
                    question: questionText,
                    options: options,
                    answer: cleanAns,
                    explanation: explanation,
                    sourceUrl: url
                });
            }
        });

        return pageData;
    } catch (err) {
        return null;
    }
}

async function run() {
    const categories = await getDICategories();
    let masterData = [];

    // DI sets follow the pattern: 001xxx, 011xxx, 021xxx (Set 1, 2, 3...)
    const series = ["001", "011", "021", "031", "041", "051"];

    for (const catUrl of categories) {
        const categoryName = catUrl.split('/').filter(Boolean).pop();
        const cleanUrl = catUrl.endsWith('/') ? catUrl : `${catUrl}/`;
        
        console.log(`\n📊 STARTING DI TOPIC: ${categoryName.toUpperCase()}`);

        for (const s of series) {
            for (let p = 1; p <= 10; p++) {
                const pageId = p.toString().padStart(3, '0');
                const targetUrl = `${cleanUrl}${s}${pageId}`;
                
                const results = await scrapeDIPage(targetUrl, categoryName);
                
                // If a page in a series is empty, skip to the next series (next table set)
                if (!results || results.length === 0) break;

                masterData = [...masterData, ...results];
                
                // Write progress to file immediately
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
                
                console.log(`   ✅ Extracted: ${targetUrl} (Found ${results.length} qns)`);
                await sleep(2500); // Respectful crawl delay
            }
        }
    }
    console.log(`\n🎉 SUCCESS! Total DI questions in JSON: ${masterData.length}`);
}

run();