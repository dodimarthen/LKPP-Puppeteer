const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { websiteURL, username, password } = require("../config.js");

puppeteer.use(StealthPlugin());

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const Scraping = async (packageNumber) => {
  const startTime = new Date();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  try {
    console.log("Opening the browser...");
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
    await delay(2000);
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".modal-header h4");

    console.log("Navigating to the target page...");
    await delay(2000);
    await page.goto(
      `https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/riwayat-negosiasi-produk/${packageNumber}`
    );
    await delay(40000);
    await page.waitForSelector("table#tblRiwayatNegosiasi");

    console.log("Pulling data...");
    const data = await page.$$eval(
      "#tblRiwayatNegosiasi thead th",
      (headers) => {
        return headers.map((header) => header.innerText.trim());
      }
    );

    const rowsData = await page.$$eval(
      "#tblRiwayatNegosiasi tbody tr",
      (rows) => {
        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll("td");
          return Array.from(columns, (column) => column.innerText.trim());
        });
      }
    );

    const result = rowsData.map((row) => {
      let rowObject = {};
      data.forEach((key, index) => {
        rowObject[key] = row[index];
      });
      return rowObject;
    });

    console.log(result);
    return result;
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

module.exports = Scraping;
