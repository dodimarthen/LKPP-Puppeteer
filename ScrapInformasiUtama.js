const scrapeInformasiUtama = async (page) => {
    // Initialize an empty array to store the extracted data
    const dataArray = [];
  
    // Select all detail items in the "informasi utama" section
    const informasiUtamaItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#informasi-utama .detail-item')).map(item => ({
        heading: item.querySelector('.detail-heading').textContent.trim(),
        description: item.querySelector('.detail-description').textContent.trim()
      }));
    });
  
    dataArray.push(...informasiUtamaItems);
  
    return dataArray;
  };
  
  module.exports = scrapeInformasiUtama;
  