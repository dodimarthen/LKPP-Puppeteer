const puppeteer = require('puppeteer');

(async () => {
    await page.waitForSelector('.table');

    const contractDetails = await page.evaluate(() => {
      const table = document.querySelector('.table');

      if (!table) {
        throw new Error('Table not found');
      }

      const contractNumber = table.querySelector('tbody tr td:nth-child(1)').textContent.trim();
      const contractDate = table.querySelector('tbody tr td:nth-child(2)').textContent.trim();

      return {'No.Kontrak': contractNumber, 'Tanggal Kontrak': contractDate}
    });

    console.log(contractDetails);

    await browser.close();
})();
