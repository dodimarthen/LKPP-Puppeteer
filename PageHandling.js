const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { websiteURL, username, password, paketbaruPage } = require('./config.js');

(async () => {
    // launch the headless browser instance
    const browser = await puppeteer.launch({ headless: false });

    // create a new page instance
    const page = await browser.newPage();

    console.log("Opening the browser..");
    await page.goto(websiteURL, {
        waitUntil: "domcontentloaded",
    });

    // Login
    console.log("Login process automation..");
    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]'); 
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector('#btnLoginPenyedia');
    await page.click('#btnLoginPenyedia');
    await page.waitForSelector('.modal-header h4');
    const headerText = await page.evaluate(() => {
        return document.querySelector('.modal-header h4').textContent;
    });

    // After successful login, navigate to the desired page
    await page.goto(paketbaruPage, {
        waitUntil: "domcontentloaded",
    });
    console.log("paket baru page successfully opened!");


    //PAGE 1
    console.log("PAGE 1");
    const hrefs1 = await scrapeHrefsFromPage(page);
    console.log('Hrefs 1:', hrefs1);



    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.evaluate(() => {
        const nextPageButton = document.querySelector('.pagination .active + li a');
        if (nextPageButton) {
            nextPageButton.click();
        }
    });

    //PAGE 2
    console.log("PAGE 2")
    await page.waitForSelector('table#tblPenawaran tbody');
    const hrefs2 = await scrapeHrefsFromPage(page);
    console.log('Hrefs 2:', hrefs2);
    

    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.evaluate(() => {
        const nextPageButton = document.querySelector('.pagination .active + li a');
        if (nextPageButton) {
            nextPageButton.click();
        }
    });

    //PAGE3
    console.log("PAGE 3")
    await page.waitForSelector('table#tblPenawaran tbody');
    const hrefs3 = await scrapeHrefsFromPage(page);
    console.log('Hrefs 3:', hrefs3);
    await browser.close();


})();

async function scrapeHrefsFromPage(page) {
    await page.waitForSelector('table#tblPenawaran tbody');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const hrefs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('table#tblPenawaran a[target="_blank"]'));
        const hrefsArray = links.map(link => {
            const hrefParts = link.getAttribute('href').split('/');
            const hrefNumber = hrefParts[hrefParts.length - 1];
            return `/v2/id/purchasing/paket/detail/${hrefNumber}`;
        });
        return hrefsArray;
    });
    return hrefs;
}
