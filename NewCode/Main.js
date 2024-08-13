import puppeteer from "puppeteer";
import { username, password, LoginPageLKPP, paketbaruPage } from "../config.js";
import { logTableLinks, processTableLinks } from "./StatusPaket.js";
import { insertData, closeConnection } from "./setupsql.js";

const formatNegosiasiResult = (negosiasiResult) => {
  return JSON.stringify(negosiasiResult);
};

const scrapAll = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(LoginPageLKPP, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".tab-content");
    console.log("got it!");

    await page.waitForSelector("#formLoginPenyedia");
    console.log("got the element of form login");

    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector("#btnLoginPenyedia");
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".main-wrapper", {
      waitUntil: "domcontentloaded",
    });
    console.log("Menu is shown successfully, login succeeded!");

    await page.goto(paketbaruPage, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".col-md-12");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Array to hold all collected links
    let allLinks = [];
    let currentPage = 1;
    const totalPages = 2;

    while (currentPage <= totalPages) {
      const pageLinks = await logTableLinks(page);
      allLinks = allLinks.concat(pageLinks);

      // Wait before moving to the next page
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Check if there's a next page and if it's not the last page
      if (currentPage < totalPages) {
        await page.click(".pagination li:nth-child(4) a");
        await page.waitForSelector(".col-md-12", {
          waitUntil: "domcontentloaded",
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        currentPage++;
      } else {
        break;
      }
    }

    // Process and save the collected links
    if (allLinks.length > 0) {
      const results = await processTableLinks(page, allLinks);

      for (const result of results) {
        const { Url_Paket, Status_Paket, ID_Paket, tableNegoResult } = result;
        const negosiasiResult = formatNegosiasiResult(tableNegoResult);
        await insertData(ID_Paket, Status_Paket, Url_Paket, negosiasiResult);
      }
    } else {
      console.log("No links found to process.");
    }
  } catch (error) {
    console.error("Error during the scraping process:", error);
  } finally {
    await browser.close();
    closeConnection();
  }
};

scrapAll();
