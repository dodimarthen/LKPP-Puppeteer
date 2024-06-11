const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  websiteURL,
  username,
  password,
} = require("./config.js");

puppeteer.use(StealthPlugin());

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const Scraping = async () => {
  const startTime = new Date();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  try {
    console.log("Opening the browser..");
    const page = await browser.newPage();

    
    console.log("Navigating to the website...");
    await page.goto(websiteURL, {
      waitUntil: "domcontentloaded",
    });

    
    console.log("Login process...");
    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector("#btnLoginPenyedia");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".modal-header h4");
    // Navigate to the specific page after login
    console.log("Navigating to the target page...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.goto("https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/riwayat-negosiasi-produk/9467486");
    await new Promise(resolve => setTimeout(resolve, 50000));
    await page.waitForSelector('table#tblRiwayatNegosiasi');
    console.log("Pulling data...")
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#tblRiwayatNegosiasi tbody tr.history-item'));
      
      const scrapedData = [];
      let currentRevisi = '';
      let currentTanggalRevisi = '';
      let currentTotalHargaPaket = '';
  
      rows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('td'));
          const isMergedRow = cells.length < 10;
  
          if (!isMergedRow) {
              currentRevisi = cells[0].textContent.trim();
              currentTanggalRevisi = cells[1].textContent.trim();
              currentTotalHargaPaket = cells[10].textContent.trim();
          }
  
          const productName = cells[2]?.querySelector('h6')?.textContent.trim() || '';
          const quantity = cells[3]?.textContent.trim() || '';
          const currency = cells[4]?.textContent.trim() || '';
          const unitPrice = cells[5]?.textContent.trim() || '';
          const shippingCost = cells[6]?.textContent.trim() || '';
          const deliveryDate = cells[7]?.textContent.trim() || '';
          const additionalNote = cells[8]?.textContent.trim() || '';
          const totalPrice = cells[9]?.textContent.trim() || '';
  
          scrapedData.push([
              currentRevisi,
              currentTanggalRevisi,
              productName,
              quantity,
              currency,
              unitPrice,
              shippingCost,
              deliveryDate,
              additionalNote,
              totalPrice,
              currentTotalHargaPaket
          ]);
      });
  
      return scrapedData;
  });
  
  console.log(data);


  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
    const endTime = new Date();
    console.log(
      `Scraping process completed in ${(endTime - startTime) / 1000} seconds.`
    );
  }
};

Scraping();
