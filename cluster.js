const { DEFAULT_VIEWPORT } = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    puppeteerOptions: {
        headless: false,
        DEFAULT_VIEWPORT: false,
    }
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    const screen = await page.screenshot();
    // Store screenshot, do something else
  });

  cluster.queue('http://www.google.com/');
  // many more pages

  await cluster.idle();
  await cluster.close();
})();