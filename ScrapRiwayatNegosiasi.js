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
    await page.goto('https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/riwayat-negosiasi-produk/8924646', {
      waitUntil: "domcontentloaded",
    });
    await new Promise(resolve => setTimeout(resolve, 13000));
    // Extract data from the table
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr.history-item')); 
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td')); 
        return cells.map(cell => cell.textContent.trim()); 
      });
    });
    
    // Find the index of the last occurrence of any revision
    let lastIndex = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].some(cell => cell.includes('Rev.'))) {
        lastIndex = i;
        break;
      }
    }
    
    // If found, slice the array from the last occurrence index until the end, else an empty array
    const revData = lastIndex !== -1 ? data.slice(lastIndex) : [];
    console.log("Data extracted under the last revision:", revData);
    console.log("Completed!");

    
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

main();
