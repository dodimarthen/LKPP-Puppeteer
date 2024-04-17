const ScrapeKontrak = async (page) => {
    // Click the "Daftar Kontrak" button
    console.log("Klik 'daftar kontrak' button");
    await page.click('a[href="/v2/id/purchasing/paket/{hrefnumber}/daftar-kontrak"]');

    // Wait for the content to load
    await new Promise(r => setTimeout(r, 1000));
    await page.waitForSelector('.table');

    // Now you can scrape the data from the table
    const SuratKontrakItems = await page.evaluate(() => {
        // Select only the No. Kontrak and Tanggal Kontrak columns
        const rows = Array.from(document.querySelectorAll('.table tbody tr'));

        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            const noKontrak = columns[0].textContent.trim();
            const tanggalKontrak = columns[1].textContent.trim();
            return { 'No. Kontrak': noKontrak, 'Tanggal Kontrak': tanggalKontrak };
        });
    });

    // Return the extracted data
    return SuratKontrakItems;
};

module.exports = ScrapeKontrak;
