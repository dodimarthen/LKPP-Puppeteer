const scrapNego = async (page, href) => {
    try {
        //Debugging process
        // Navigate to the specific URL containing the table
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
            waitUntil: "domcontentloaded",
        });
        // adding time.sleep
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Extract data from the table
        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr.history-item')); 
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td')); 
                return cells.map(cell => cell.textContent.trim()); 
            });
        });
        
        // Check if there are any history items or cells
        if (data.length === 0 || data.every(row => row.length === 0)) {
            return "no history of negotiation";
        }

        // Find the index of the last occurrence of any revision
        let lastIndex = -1;
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].some(cell => cell.includes('Rev.'))) {
                lastIndex = i;
                break;
            }
        }
        
        // If found, slice the array from the last occurrence index until the end, else an empty array
        const revData = lastIndex !== -1 ? data.slice(lastIndex) : [];
        console.log("Data extracted under the last revision:", revData);
        console.log("Completed!");

        return revData;

    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = scrapNego;
