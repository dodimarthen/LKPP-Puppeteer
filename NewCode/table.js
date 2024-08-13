import puppeteer from "puppeteer";
import { username, password, LoginPageLKPP, paketbaruPage } from "../config.js";

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
    console.log("Menu is showed successfully, login succeed!");

    await page.goto(paketbaruPage, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".col-md-12");
    console.log("table daftar paket shown");
    await page.goto(
      "https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/detail/10071760",
      { waitUntil: "domcontentloaded" }
    );
    console.log("daftar paket clicked");
    await page.waitForSelector(
      'a[href="/v2/id/purchasing/paket/riwayat-negosiasi-produk/10071760"].btn.btn-sm.btn-primary',
      {
        visible: true, // Make sure the element is visible
      }
    );
    await page.click(
      'a[href="/v2/id/purchasing/paket/riwayat-negosiasi-produk/10071760"].btn.btn-sm.btn-primary'
    );

    console.log("Clicked on 'Riwayat Negosiasi' button!");

    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (error) {
    console.error("Error during the scraping process:", error);
  } finally {
    await browser.close();
  }
};

scrapAll();
