const scrapePpPpk = async (page) => {
    // Initialize an empty array to store the extracted data
    const dataArray = [];
  
    // Select all detail items in the "pp-ppk" section
    const ppPpkItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#pp-ppk .detail-item')).map(item => ({
        heading: item.querySelector('.detail-heading').textContent.trim(),
        description: item.querySelector('.detail-description').textContent.trim()
      }));
    });
  
    dataArray.push(...ppPpkItems);
  
    return dataArray;
  };
  
  module.exports = scrapePpPpk;
  