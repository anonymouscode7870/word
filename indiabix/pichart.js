const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const PIE_CHART_URL = `${BASE_URL}/data-interpretation/pie-charts/`;
const OUTPUT_FILE = 'indiabix_pie_charts_full.json';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeSet(url) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);

        // Capture Instructions
        const instructions = $('.bix-td-direction').text().trim();
        if (!instructions) return null; // If no instructions, page likely doesn't exist

        // Capture Pie Chart Image
        let chartImages = [];
        $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && src.includes('pie-charts') && !src.includes('icon')) {
                chartImages.push(src.startsWith('http') ? src : BASE_URL + src);
            }
        });

        // Capture Table
        let tableHtml = null;
        const tableTag = $('.bix-div-direction table, .bix-tbl-container table').first();
        if (tableTag.length) {
            tableHtml = `<table border="1" style="border-collapse: collapse; width: 100%;">${tableTag.html()}</table>`;
        }

        const questions = [];
        $('.bix-div-container').each((i, el) => {
            const qBlock = $(el);
            questions.push({
                text: qBlock.find('.bix-td-qtxt').text().trim(),
                options: qBlock.find('.bix-td-option-val').map((j, opt) => $(opt).text().trim()).get(),
                answer: qBlock.find('.jq-hdnakanswer').text().trim(),
                explanation: qBlock.find('.bix-ans-description').text().trim()
            });
        });

        return { sourceUrl: url, instructions, chartImages, tableHtml, questions };
    } catch (err) { return null; }
}

async function run() {
    let allData = [];
    
    // Series starts at 001 and goes up to 021 as per your list
    const seriesList = [
        "001", "011", "012", "013", "014", "015", 
        "016", "017", "018", "019", "020", "021"
    ];

    for (const series of seriesList) {
        console.log(`\n📂 Starting Series: ${series}`);
        
        // Check 10 pages per series (usually 001001, 001002...)
        for (let p = 1; p <= 10; p++) {
            const pageId = p.toString().padStart(3, '0');
            const targetUrl = `${PIE_CHART_URL}${series}${pageId}`;
            
            console.log(`   🚀 Scraping: ${targetUrl}`);
            const result = await scrapeSet(targetUrl);
            
            if (!result) {
                console.log(`   ⏹️ End of series ${series}`);
                break; 
            }

            allData.push(result);
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
            await sleep(2000);
        }
    }
    console.log(`\n✅ Done! Total Pie Chart sets collected: ${allData.length}`);
}

run();