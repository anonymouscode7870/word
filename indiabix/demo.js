const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeIndiaBIX(topicName, baseUrl) {
    const browser = await puppeteer.launch({ 
        headless: "new", // Set to false if you want to watch the browser work
        defaultViewport: null 
    });
    
    const page = await browser.newPage();
    let allQuestions = [];
    let currentPageUrl = baseUrl;

    try {
        while (currentPageUrl) {
            console.log(`🔎 Scraping: ${currentPageUrl}`);
            await page.goto(currentPageUrl, { waitUntil: 'networkidle2' });

            // Extract data from the current page
            const pageData = await page.evaluate((topic) => {
                const results = [];
                const containers = document.querySelectorAll('.bix-div-container');

                containers.forEach(container => {
                    const question = container.querySelector('.bix-td-qtxt')?.innerText.trim();
                    const options = Array.from(container.querySelectorAll('.bix-td-option-val'))
                                         .map(opt => opt.innerText.trim());
                    const answer = container.querySelector('.jq-hdnakv')?.value;
                    const explanation = container.querySelector('.bix-ans-description')?.innerText.trim();

                    if (question) {
                        results.push({
                            topic: topic,
                            question: question,
                            options: options,
                            answer: answer, // 'A', 'B', etc.
                            explanation: explanation,
                            difficulty: "medium"
                        });
                    }
                });
                return results;
            }, topicName);

            allQuestions.push(...pageData);

            // Logic to find and click the 'Next' button
            const nextLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.mx-pager-item a'));
                const nextBtn = links.find(a => a.innerText.includes('Next') || a.innerText.includes('»'));
                return nextBtn ? nextBtn.href : null;
            });

            if (nextLink && nextLink !== currentPageUrl) {
                currentPageUrl = nextLink;
                // Small delay to be polite to the server
                await new Promise(r => setTimeout(r, 1500)); 
            } else {
                currentPageUrl = null; // No more pages
            }
        }

        // Save to JSON file
        const folderPath = path.join(__dirname, 'data', 'Aptitude');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `${topicName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(allQuestions, null, 2), 'utf-8');
        
        console.log(`\n✅ Success! Saved ${allQuestions.length} questions to ${filePath}`);

    } catch (error) {
        console.error("❌ Scraping failed:", error);
    } finally {
        await browser.close();
    }
}

// EXECUTION: Change these for different topics
const TOPIC = "problems-on-trains";
const START_URL = "https://www.indiabix.com/aptitude/problems-on-trains/";

scrapeIndiaBIX(TOPIC, START_URL);