const getStatus = async (page) => {
    const details = await page.evaluate(() => {
        const detailElements = document.querySelectorAll('.detail-item');
        const details = [];
        detailElements.forEach(element => {
            const headingElement = element.querySelector('.detail-heading');
            const descriptionElement = element.querySelector('.detail-description');
            if (headingElement && descriptionElement) {
                const heading = headingElement.textContent.trim();
                const description = descriptionElement.textContent.trim();
                details.push({ heading, description });
            }
        });
        return details;
    });

    // Find the detail with the heading "Status"
    const statusDetail = details.find(detail => detail.heading === "Status");
    return statusDetail;
};

module.exports = getStatus;
