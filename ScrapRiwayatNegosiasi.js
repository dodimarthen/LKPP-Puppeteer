const scrapNego = async (page, href) => {
    try {
        //Debugging process
        // Navigate to the specific URL containing the table
        await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
            waitUntil: "domcontentloaded",
        });
        // adding time.sleep
        await new Promise(resolve => setTimeout(resolve, 18000));

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
            return output;
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
        
        // Create an object with keys and values
        const output = {};

        // Check if the data is an array or a single value
        if (Array.isArray(revData) && revData.length > 0) {
            revData[0].forEach((value, index) => {
                output[keys[index]] = value;
            });
        } else {
            keys.forEach(key => {
                output[key] = null;
            });
        }

        return output;

    } catch (error) {
        console.error(error);
        return {};
    }
};

module.exports = scrapNego;
