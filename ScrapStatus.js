const getStatus = async (page) => {
    const details = await page.evaluate(() => {
        const detailElements = document.querySelectorAll('.detail-item');
        const details = {};
        detailElements.forEach(element => {
            const headingElement = element.querySelector('.detail-heading');
            const descriptionElement = element.querySelector('.detail-description');
            if (headingElement && descriptionElement) {
                const heading = headingElement.textContent.trim();
                const description = descriptionElement.textContent.trim();
                details[heading] = description;
            }
        });
        return details;
    });

    return { Status: details["Status"] };
};

module.exports = getStatus;
