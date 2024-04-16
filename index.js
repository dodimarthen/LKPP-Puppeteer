const puppeteer = require('puppeteer');
const { websiteURL, username, password, paketbaruPage } = require('./config.js');

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

    //Login
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
    
    //Go to the "paket baru" page
    await page.goto(paketbaruPage, {
      waitUntil: "domcontentloaded",
    });

    // Wait for the table to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForSelector('table#tblPenawaran tbody');
    const hrefs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('table#tblPenawaran a[target="_blank"]'));
        return links.map(link => link.getAttribute('href'));
      });
    
      console.log(hrefs); 

      for (const href of hrefs) {
        await page.goto(`https://yourwebsite.com${href}`, { waitUntil: 'domcontentloaded' });
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

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
