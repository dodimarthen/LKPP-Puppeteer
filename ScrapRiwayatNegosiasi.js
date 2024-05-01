const puppeteer = require('puppeteer-extra');
const { websiteURL, username, password, paketbaruPage, testing_url_scrap_riwayatdata } = require('./config.js');

async function main() {
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
    console.log("Login process automation..");
    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector('#btnLoginPenyedia');
    await page.click('#btnLoginPenyedia');
    await page.waitForSelector('.modal-header h4');
  
    // Navigate to the desired page
    await page.goto(paketbaruPage, {
      waitUntil: "domcontentloaded",
    });

    // Navigate to the specific URL containing the table
    await page.goto(testing_url_scrap_riwayatdata, {
      waitUntil: "domcontentloaded",
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    // Extract data from the table
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr.history-item')); 
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td')); 
        return cells.map(cell => cell.textContent.trim()); 
      });
    });

    const rev1Index = data.findIndex(row => row.includes('Rev. 6'));
    const rev1Data = rev1Index !== -1 ? data.slice(rev1Index) : [];
    console.log("Data extracted under 'Rev. 6':", rev1Data);

    console.log("Completed!");
    
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

main();
