const scrapeH6Data = async (page) => {
    try {
        await page.evaluate(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 4000);
            });
        });

        await page.waitForSelector('#tblRiwayatNegosiasi tbody tr.history-item h6');

        const h6Data = await page.evaluate(() => {
            const h6Elements = document.querySelectorAll('#tblRiwayatNegosiasi tbody tr.history-item h6');
            const dataList = Array.from(h6Elements).map(h6 => h6.textContent.trim());
            return dataList;
        });

        return h6Data;

    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
};
