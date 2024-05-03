const fs = require("fs");
const { Cluster } = require("puppeteer-cluster");

const urls = [
  "https://www.amazon.com/s?k=smartphones&_encoding=UTF8&content-id=amzn1.sym.061f5f08-3bb1-4c70-8051-5d850a92de53&pd_rd_r=9c88807f-a6a0-4499-8bf9-0c81a2f510aa&pd_rd_w=ltRuN&pd_rd_wg=w6mt2&pf_rd_p=061f5f08-3bb1-4c70-8051-5d850a92de53&pf_rd_r=3SJTDX6KMN6Q0AWYRMK1&ref=pd_hp_d_atf_unk",
  "https://www.amazon.com/s?k=Dresses&_encoding=UTF8&content-id=amzn1.sym.bad2a3cf-6397-46b0-aa92-6036dbc4afb6&crid=1PW0S93CC85GY&pd_rd_r=3d486013-4468-41e9-9fd9-d9c3528fa792&pd_rd_w=3Vz3P&pd_rd_wg=PTx21&pf_rd_p=bad2a3cf-6397-46b0-aa92-6036dbc4afb6&pf_rd_r=8590G522SDCWBKJBQVJH&sprefix=dresses%2Caps%2C146&ref=pd_hp_d_atf_unk",
];

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 100,
    monitor: true,
    puppeteerOptions: {
      headless: false,
      defaultViewport: false,
      userDataDir: "./tmp",
    },
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);

    let isBtnDisabled = false;
    while (!isBtnDisabled) {
      await page.waitForSelector('[data-cel-widget="search_result_0"]');
      const productsHandles = await page.$$(
        "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
      );

      for (const producthandle of productsHandles) {
        let title = "Null";
        let price = "Null";
        let img = "Null";

        try {
          title = await page.evaluate(
            (el) => el.querySelector("h2 > a > span").textContent,
            producthandle
          );
        } catch (error) {}

        try {
          price = await page.evaluate(
            (el) => el.querySelector(".a-price > .a-offscreen").textContent,
            producthandle
          );
        } catch (error) {}

        try {
          img = await page.evaluate(
            (el) => el.querySelector(".s-image").getAttribute("src"),
            producthandle
          );
        } catch (error) {}
        if (title !== "Null") {
          fs.appendFile(
            "results.csv",
            `${title.replace(/,/g, ".")},${price},${img}\n`,
            function (err) {
              if (err) throw err;
            }
          );
        }
      }

      await page.waitForSelector("li.a-last", { visible: true });
      const is_disabled = (await page.$("li.a-disabled.a-last")) !== null;

      isBtnDisabled = is_disabled;
      if (!is_disabled) {
        await Promise.all([
          page.click("li.a-last"),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
      }
    }
  });

  for (const url of urls) {
    await cluster.queue(url);
  }

  await cluster.idle();
  await cluster.close();
})();