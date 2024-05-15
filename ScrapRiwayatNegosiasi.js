const scrapNego = async (page, href) => {
    try {
        // Navigate to the specific URL containing the table
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
            waitUntil: "domcontentloaded",
        });
        // Adding delay to ensure data is loaded
        await new Promise(resolve => setTimeout(resolve, 25000));

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
            const keys = ["Revisi", "Tanggal Revisi", "Nama Produk", "Kuantitas", "Mata Uang", "Harga Satuan", "Ongkos Kirim", "Tanggal Pengiriman Produk", "Catatan Tambahan", "Total Harga", "Total Harga Paket"];
            const output = {};
            keys.forEach(key => {
                output[key] = null;
            });
            return [output];
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

        // Define keys for each value
        const keys = ["Revisi", "Tanggal Revisi", "Nama Produk", "Kuantitas", "Mata Uang", "Harga Satuan", "Ongkos Kirim", "Tanggal Pengiriman Produk", "Catatan Tambahan", "Total Harga", "Total Harga Paket"];
        
        // Create an array to hold objects for each product
        const outputArray = [];

        // Iterate through each row in revData to create an object for each product
        revData.forEach(row => {
            const output = {};
            row.forEach((value, index) => {
                output[keys[index]] = value;
            });
            outputArray.push(output);
        });

        return outputArray;

    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = scrapNego;
