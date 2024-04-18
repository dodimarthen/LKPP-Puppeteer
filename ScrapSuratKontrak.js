const ScrapeKontrak = async (page) => {
    try {
        // Wait for the content to load
        await new Promise(r => setTimeout(r, 2000));

        // Now you can scrape the data from the table
        const SuratKontrakItems = await page.evaluate(() => {
            // Select only the No. Kontrak and Tanggal Kontrak columns
            const rows = Array.from(document.querySelectorAll('.table tbody tr'));

            return rows.map(row => {
                const columns = row.querySelectorAll('td');
                const noKontrak = columns[0] ? columns[0].textContent.trim() : null;
                const tanggalKontrak = columns[1] ? columns[1].textContent.trim() : null;
                return { 'No. Kontrak': noKontrak, 'Tanggal Kontrak': tanggalKontrak };
            });
        });

        // Return the extracted data
        return SuratKontrakItems;
    } catch (error) {
        // Log the error without returning any data
        console.error('Error scraping data:', error);
        return []; // Or return null, depending on your use case
    }
};

module.exports = ScrapeKontrak;
