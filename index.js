const puppeteer = require('puppeteer-extra');
const { websiteURL, username, password, paketbaruPage } = require('./config.js');
const scrapeInformasiUtama = require('./ScrapInformasiUtama');
const scrapePpPpk = require('./ScrapPPK.js');

// Add stealth plugin and use defaults
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const getQuotes = async () => {
  // Record the start time
  const startTime = new Date();

  // Start a Puppeteer session:
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    // Open a new page
    console.log("Opening the browser..");
    const page = await browser.newPage();
    await page.goto(websiteURL, {
      waitUntil: "domcontentloaded",
    });

    // Login
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

    await page.goto("https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/detail/8929530", {
      waitUntil: "domcontentloaded",
    });

    await new Promise(resolve => setTimeout(resolve, 5000));
    const informasiUtamaData = await scrapeInformasiUtama(page);
    console.log("Informasi Utama Data:", informasiUtamaData);
    // const ppkData = await scrapePpPpk(page);
    // console.log("PpPppk: ", ppkData);
  

    console.log(data);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    console.log("Closing the browser..");
    await browser.close();  
    
    // Calculate the process time
    const endTime = new Date();
    const processTime = (endTime - startTime) / 1000;

    // Display the process time
    console.log("Process time:", processTime, "seconds");
  }
};

// Start the scraping
getQuotes();
