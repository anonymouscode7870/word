const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.indiabix.com';
const START_URL = `${BASE_URL}/verbal-ability/questions-and-answers/`;
const OUTPUT_FILE = 'verbal_fixed.json';

// These headers make you look like a real Chrome user
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/'
};

async function getCategories() {
    try {
        const { data } = await axios.get(START_URL, { headers });
        const $ = cheerio.load(data);
        const categories = [];

        // Updated selector to be more "greedy" to find links
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('/verbal-ability/') && !link.includes('questions-and-answers')) {
                categories.push(link.startsWith('http') ? link : BASE_URL + link);
            }
        });
        return [...new Set(categories)];
    } catch (err) { 
        console.log("Error fetching topics. You might be blocked.");
        return []; 
    }
}

async function scrapePage(url, topic) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const questions = [];

        $('.bix-div-container').each((i, el) => {
            const qBlock = $(el);
            const questionText = qBlock.find('.bix-td-qtxt').text().trim();
            const options = qBlock.find('.bix-td-option-val').map((j, opt) => $(opt).text().trim()).get();
            
            // Getting the Answer Correctly:
            // IndiaBIX stores it in a hidden div or an input with 'jq-hdnakanswer'
            let rawAns = qBlock.find('.jq-hdnakanswer').text().trim(); 
            let finalAns = rawAns.replace(/Option\s+/i, '').charAt(0).toUpperCase();

            const explanation = qBlock.find('.bix-ans-description').text().trim();

            if (questionText) {
                questions.push({
                    topic,
                    question: questionText,
                    options,
                    answer: finalAns, // This will now show 'A', 'B', etc.
                    explanation
                });
            }
        });
        return questions;
    } catch (err) { return null; }
}

// ... rest of your 'run' function remains the same