import puppeteer from "puppeteer";
import { username, password, LoginPageLKPP, paketbaruPage } from "./config.js";
import { logTableLinks } from "./StatusPaket.js";

const login = async () => {
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
    console.log("Menu is showed successfully, login succeed!");

    await page.goto(paketbaruPage, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".col-md-12");
    console.log("Daftar paket shown!");

    const h4Text = await page.evaluate(() => {
      const element = document.querySelector(".col-md-12 h4");
      return element ? element.innerText : null;
    });

    console.log("Text in <h4>:", h4Text);

    // Wait for the page to settle before calling logTableLinks
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await logTableLinks(page);
  } catch (error) {
    console.error("Error waiting for selector:", error);
  } finally {
    await browser.close();
  }
};

login();
