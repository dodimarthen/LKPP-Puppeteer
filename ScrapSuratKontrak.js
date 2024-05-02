async function scrapeKontrak(page, href) {
  await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
      waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('.table');
  const contractDetails = await page.evaluate(() => {
      const table = document.querySelector('.table');

      if (!table) {
          throw new Error('Table not found');
      }

      // Check if "No data found" message is present in the table
      const noDataElement = table.querySelector('tbody tr td[colspan="6"] center');
      if (noDataElement && noDataElement.textContent.trim() === "No data found") {
          return {'No.Kontrak': 'Null', 'Tanggal Kontrak': 'Null'};
      }

      const contractNumber = table.querySelector('tbody tr td:nth-child(1)').textContent.trim();
      const contractDate = table.querySelector('tbody tr td:nth-child(2)').textContent.trim();

      return {'No.Kontrak': contractNumber, 'Tanggal Kontrak': contractDate};
  });

  console.log(contractDetails);
  await new Promise(resolve => setTimeout(resolve, 2000));
}
module.exports = scrapeKontrak;