export async function logInformasiUtamaPemesanPPK(page) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await page.waitForSelector(".tab-content", { timeout: 7000 });

    const data = await page.evaluate(() => {
      const extractDetails = (selector) => {
        const items = document.querySelectorAll(selector);
        return Array.from(items).map((item) => {
          const heading = item
            .querySelector(".detail-heading")
            ?.innerText?.trim();
          const description = item
            .querySelector(".detail-description")
            ?.innerText?.trim();
          return { heading, description };
        });
      };

      const informasiUtama = extractDetails("#informasi-utama .detail-item");
      const pemesanPPK = extractDetails("#pp-ppk .detail-item");

      return { informasiUtama, pemesanPPK };
    });

    const formatDetails = (details) => {
      return details
        .map((detail) => `${detail.heading}: "${detail.description}"`)
        .join(",\n");
    };

    console.log("Informasi Utama:\n", formatDetails(data.informasiUtama));
    console.log("Pemesan & PPK:\n", formatDetails(data.pemesanPPK));
  } catch (error) {
    console.error("Error scraping details:", error);
  }
}
