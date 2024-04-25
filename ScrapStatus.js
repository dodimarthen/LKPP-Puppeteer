const scrapeStatus = async (page) => {
    try {
        // Initialize an empty object to store the extracted data
        const dataObject = {};

        // Wait for the status section to be present
        await page.waitForSelector('#status');

        // Select all detail items in the "status" section
        const statusItem = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#status .detail-item')).map(item => ({
                heading: item.querySelector('.detail-heading').textContent.trim(),
                description: item.querySelector('.detail-description').textContent.trim()
            }));
        });

        // Convert the array of objects into a single object
        statusItem.forEach(item => {
            dataObject[item.heading] = item.description;
        });

        return dataObject;
    } catch (error) {
        console.error('Error scraping status:', error);
        return null; // Return null or handle the error as appropriate
    }
};

module.exports = scrapeStatus;
