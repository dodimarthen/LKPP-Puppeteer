const puppeteer = require('puppeteer-extra');
const { websiteURL, username, password, paketbaruPage } = require('./config.js');
const scrapeInformasiUtama = require('./ScrapInformasiUtama');
const scrapePpPpk = require('./ScrapPPK.js');
const scrapeKontrak = require('./ScrapSuratKontrak.js');
// const processHref = require('./processHref');

// Add stealth plugin and use defaults
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Page } = require('puppeteer');
puppeteer.use(StealthPlugin());

const Scraping = async () => {
  // Record the start time
  const startTime = new Date();

  // Start a Puppeteer session:
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  


  // SCRAPING PROCESS
  try {
    // Open a new page
    console.log("Opening the browser..");
    const page = await browser.newPage();
    await page.goto(websiteURL, {
      waitUntil: "domcontentloaded",
    });

    // Login
    console.log("Login process automation..")
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
    
    await page.goto(paketbaruPage, {
      waitUntil: "domcontentloaded",
    });

    //GATHERING DATA
    // Wait for the table to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForSelector('table#tblPenawaran tbody');
    const hrefs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('table#tblPenawaran a[target="_blank"]'));
        const hrefsArray = links.map(link => {
            const hrefParts = link.getAttribute('href').split('/');
            const hrefNumber = hrefParts[hrefParts.length - 1];
            return `/v2/id/purchasing/paket/detail/${hrefNumber}`;
        });
        return hrefsArray;
    });

    // console.log(hrefs);

    const hrefKontrak = hrefs.map(hrefNumber => `${hrefNumber}/daftar-kontrak`.replace('/detail', ''));
    console.log(hrefKontrak);
    for (const href of hrefKontrak){
      await scrapeKontrak(page, href);
    }
      // Loop every href and pull the data
      for (const href of hrefs) {
        console.log("Go to Specific Paket Data Page..");
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
            waitUntil: "domcontentloaded",
        });
    
        console.log("Scraping Informasi Utama, PP/PPK BMKG data, surat kontrak..");
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        // Call function to pull data
        const informasiUtamaData = await scrapeInformasiUtama(page);
        const ppkData = await scrapePpPpk(page);
        const kontrakData = await scrapeKontrak(page, href); // Added line to scrape kontrak data
    
        // Combine all data into a single array
        const combinedData = [informasiUtamaData, ppkData, kontrakData]; // Combine kontrakData with the others
        console.log(combinedData);
    
        // pausing every loop
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Error Handling
  } catch (error) {
    console.error('An error occurred:', error.stack);
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
Scraping();