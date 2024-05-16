const scrapePpPpk = async (page) => {
  // Initialize an empty object to store the extracted data
  const dataObject = {};

  // Select all detail items in the "pp-ppk" section
  const ppPpkItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#pp-ppk .detail-item')).map(item => ({
      heading: item.querySelector('.detail-heading').textContent.trim(),
      description: item.querySelector('.detail-description').textContent.trim()
    }));
  });

  // Convert the array of objects into a single object
  ppPpkItems.forEach(item => {
      dataObject[item.heading] = item.description;
  });

  return dataObject;
};

module.exports = scrapePpPpk;
