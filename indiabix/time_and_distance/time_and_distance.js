const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeTopic(topicName, sectionCode) {
    let page = 1;
    let allQuestions = [];
    let hasMore = true;

    console.log(`🚀 Starting Full Scrape for: ${topicName}`);

    while (hasMore) {
        // Generate ID like 006001, 006002...
        // sectionCode for Time & Distance is 006. For Trains it was 038.
        const id = page === 1 ? "" : `${sectionCode}${page.toString().padStart(3, '0')}`;
        const url = `https://www.indiabix.com/aptitude/${topicName}/${id}`;
        
        try {
            console.log(`📦 Fetching Page ${page}: ${url}`);
            const { data } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });

            const $ = cheerio.load(data);
            const containers = $('.bix-div-container');

            if (containers.length === 0) {
                hasMore = false;
                break;
            }

            containers.each((i, element) => {
                const question = $(element).find('.bix-td-qtxt').text().trim();
                const options = [];
                $(element).find('.bix-td-option-val').each((j, opt) => options.push($(opt).text().trim()));

                // Hidden Answer Extraction
                const ansChar = $(element).find('input[id^="hdnAnswer"]').val() || 
                               $(element).find('.jq-hdnakqb').val() || "";
                
                const charMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
                const correctOption = charMap[ansChar.toLowerCase()];

                const explanation = $(element).find('.bix-ans-description').text().trim();

                allQuestions.push({
                    topic: topicName,
                    question,
                    options,
                    correctOption: correctOption ?? null,
                    explanation,
                    difficulty: "medium"
                });
            });

            page++;
            await sleep(1000); // 1-second delay to stay undetected
        } catch (error) {
            console.error(`❌ Error at page ${page}: ${error.message}`);
            hasMore = false;
        }
    }

    const fileName = `${topicName.replace(/-/g, '_')}_full.json`;
    fs.writeFileSync(fileName, JSON.stringify(allQuestions, null, 2));
    console.log(`✅ Task Complete! Saved ${allQuestions.length} questions to ${fileName}`);
}

// RUN FOR TIME AND DISTANCE
// Topic: 'time-and-distance', Section Code: '006'
scrapeTopic('time-and-distance', '006');