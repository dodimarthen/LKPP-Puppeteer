const scrapNego = async (page, href) => {
    try {
        // Navigate to the specific URL containing the table
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
            waitUntil: "domcontentloaded",
        });
        
        await new Promise(resolve => setTimeout(resolve, 25000));
        await page.waitForSelector('table#tblRiwayatNegosiasi');

        console.log("Pulling data...");
        const data = await page.$$eval('#tblRiwayatNegosiasi tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.innerText);
            });
        });

        const Data = data.filter(row => row.length > 0);
        console.log(Data);
    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = scrapNego;
