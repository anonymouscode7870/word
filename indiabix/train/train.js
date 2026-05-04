const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapePage(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const pageQuestions = [];

        $('.bix-div-container').each((i, element) => {
            // 1. Extract Question
            const question = $(element).find('.bix-td-qtxt').text().trim();
            if (!question) return;

            // 2. Extract Options
            const options = [];
            $(element).find('.bix-td-option-val').each((j, opt) => {
                options.push($(opt).text().trim());
            });

            // 3. FIX: Extract Correct Answer Letter (A, B, C, D)
            // IndiaBIX uses a hidden input with the class 'jq-hdnakqb' or an ID like 'hdnAnswer_455'
            const answerLetter = $(element).find('input[type="hidden"]').filter(function() {
                return $(this).attr('id') && $(this).attr('id').includes('hdnAnswer');
            }).val() || $(element).find('.jq-hdnakqb').val();

            const charMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
            const correctOption = answerLetter ? charMap[answerLetter.toLowerCase()] : null;

            // 4. Extract Explanation
            const explanation = $(element).find('.bix-ans-description').text().trim();

            pageQuestions.push({
                topic: "problems-on-trains",
                question: question,
                options: options,
                correctOption: correctOption,
                explanation: explanation,
                difficulty: "medium"
            });
        });

        return pageQuestions;
    } catch (error) {
        console.error(`Error on ${url}: ${error.message}`);
        return [];
    }
}

async function runScraper() {
    const pageIds = ["", "038002", "038003", "038004", "038005", "038006", "038007"];
    let allData = [];

    for (const id of pageIds) {
        const url = `https://www.indiabix.com/aptitude/problems-on-trains/${id}`;
        console.log(`Scraping: ${url}`);
        const data = await scrapePage(url);
        allData = allData.concat(data);
        await sleep(1000); 
    }

    // Double check: filter out any where correctOption might have failed
    const finalData = allData.filter(q => q.correctOption !== null);

    fs.writeFileSync('problems_on_trains_full.json', JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`Done! Saved ${finalData.length} questions with answers.`);
}

runScraper();