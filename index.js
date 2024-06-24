const puppeteer = require("puppeteer-extra");
const mysql = require("mysql2/promise");
const {websiteURL, username, password, paketbaruPage, LoginPageLKPP} = require("./config.js");
const scrapeInformasiUtama = require("./DataExtraction/ScrapInformasiUtama.js");
const scrapePpPpk = require("./DataExtraction/ScrapPPK.js");
const scrapeKontrak = require("./DataExtraction/ScrapSuratKontrak.js");
const getStatus = require("./DataExtraction/ScrapStatus.js");
const scrapNego = require("./DataExtraction/ScrapRiwayatNegosiasi.js");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { insertDataIntoDB } = require("./InsertData.js");

puppeteer.use(StealthPlugin());

const Scraping = async () => {
  // Record the start time
  const startTime = new Date();

  // Start a Puppeteer session
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  
  // SCRAPING PROCESS
  try {
    // Open a new page
    console.log("Opening the browser..");
    const page = await browser.newPage();
    await page.goto(LoginPageLKPP, {
      waitUntil: "domcontentloaded",
    });

    // Login
    console.log("Login process automation..");
    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector("#btnLoginPenyedia");
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".modal-header h4");

    await page.goto(paketbaruPage, {
      waitUntil: "domcontentloaded",
    });

    const allHrefs = [];

    for (let i = 1; i <= 14; i++) {
      console.log("Scraping href from page", i);
      const hrefs = await scrapeHrefsFromPage(page);
      allHrefs.push(...hrefs);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      await page.evaluate(() => {
        const nextPageButton = document.querySelector(
          ".pagination .active + li a"
        );
        if (nextPageButton) {
          nextPageButton.click();
        }
      });
    }

    for (const href of allHrefs) {
      try {
        // Log the original href
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
          waitUntil: "domcontentloaded",
        });

        console.log(
          "Scraping Informasi Utama, PP/PPK BMKG, SK, Riwayat Negosiasi data for :",
          href
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        //Call function to pull data for informasiUtama and ppkData using the original href
        const informasiUtamaData = await scrapeInformasiUtama(page);
        const ppkData = await scrapePpPpk(page);
        const statusData = await getStatus(page);
        // Log the modified href for kontrakData
        const hrefKontrak = `${href}/daftar-kontrak`.replace("/detail", "");
        const kontrakData = await scrapeKontrak(page, hrefKontrak);
        //Pull data riwayat negosiasi
        // const hrefRiwayatNegosiasi = href.replace('/detail', '/riwayat-negosiasi-produk');
        // const negosiasiData = await scrapNego(page, hrefRiwayatNegosiasi);
        // console.log(negosiasiData);
        // Combine all data into a single object
        const combinedData = {
          ...informasiUtamaData,
          ...ppkData,
          ...statusData,
          ...kontrakData,
          // ...negosiasiData,
        };
        console.log(combinedData);


        // Pausing every loop
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Error processing href ${href}:`, error);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error.stack);
  } finally {
    // Close the browser
    console.log("Closing the browser..");
    await browser.close();

    // Release the MySQL connection pool
    await pool.end();

    // Calculate the process time
    const endTime = new Date();
    const processTime = (endTime - startTime) / 1000;

    // Display the process time
    console.log("Process time:", processTime, "seconds");
  }
};

async function scrapeHrefsFromPage(page) {
  await page.waitForSelector("table#tblPenawaran tbody");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const hrefs = await page.evaluate(() => {
    const links = Array.from(
      document.querySelectorAll('table#tblPenawaran a[target="_blank"]')
    );
    const hrefsArray = links.map((link) => {
      const hrefParts = link.getAttribute("href").split("/");
      const hrefNumber = hrefParts[hrefParts.length - 1];
      return `/v2/id/purchasing/paket/detail/${hrefNumber}`;
    });
    return hrefsArray;
  });
  return hrefs;
}

// Call the Scraping function
Scraping();
