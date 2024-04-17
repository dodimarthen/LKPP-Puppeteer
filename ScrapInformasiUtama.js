const scrapeInformasiUtama = async (page) => {
    // Initialize an empty object to store the extracted data
    const dataObject = {};

    // Select all detail items in the "informasi utama" section
    const informasiUtamaItems = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#informasi-utama .detail-item')).map(item => ({
            heading: item.querySelector('.detail-heading').textContent.trim(),
            description: item.querySelector('.detail-description').textContent.trim()
        }));
    });

    // Convert the array of objects into a single object
    informasiUtamaItems.forEach(item => {
        dataObject[item.heading] = item.description;
    });

    return dataObject;
};

module.exports = scrapeInformasiUtama;
