async function processHref(href) {
    console.log("Go to Specific Paket Data Page..");
    await page.goto(`https://e-katalog.lkpp.go.id${href}`, {
      waitUntil: "domcontentloaded",
    });
  
    console.log("Scraping Informasi Utama, PP/PPK BMKG data, surat kontrak..");
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    const informasiUtamaData = await scrapeInformasiUtama(page);
    const ppkData = await scrapePpPpk(page);
    // const kontrakData = await ScrapeKontrak(page);
  
    // Combine all data into a single array
    const combinedData = [informasiUtamaData, ppkData];
    console.log(combinedData);
  }
  