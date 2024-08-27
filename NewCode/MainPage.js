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

    const filterDetails = (details, keys) => {
      return details.filter((detail) => keys.includes(detail.heading));
    };

    const selectedKeysInformasiUtama = [
      "ID Paket",
      "Etalase Produk",
      "Nama Paket",
      "Satuan Kerja",
      "Alamat Pengiriman",
      "Total Produk",
    ];

    const selectedKeysPemesanPPK = ["Nama"]; // Only filter for the "Nama" field

    const filteredInformasiUtama = filterDetails(
      data.informasiUtama,
      selectedKeysInformasiUtama
    );
    const filteredPemesanPPK = filterDetails(
      data.pemesanPPK,
      selectedKeysPemesanPPK
    );

    // Only keep the second "Nama" field, assuming it corresponds to "Nama PPK"
    const filteredPPK =
      filteredPemesanPPK.length > 1 ? [filteredPemesanPPK[1]] : [];

    if (filteredPPK.length > 0) {
      filteredPPK[0].heading = "Nama PPK"; // Rename to "Nama PPK"
    }

    console.log("Filtered Informasi Utama:", filteredInformasiUtama);
    console.log("Filtered PPK:", filteredPPK);

    return {
      informasiUtama: filteredInformasiUtama,
      ppk: filteredPPK,
    };
  } catch (error) {
    console.error("Error scraping details:", error);
  }
}

export async function logInformasiDaftarKontrak(page) {
  try {
    await page.waitForSelector("a.btn.btn-primary", {
      visible: true,
      timeout: 6000,
    });

    const isButtonVisible = await page.evaluate(() => {
      const buttons = document.querySelectorAll("a.btn.btn-primary");
      for (const button of buttons) {
        if (button.textContent.trim() === "Daftar Kontrak") {
          return button && button.offsetParent !== null;
        }
      }
      return false;
    });

    if (isButtonVisible) {
      console.log('Button "Daftar Kontrak" is visible.');

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.evaluate(() => {
          const buttons = document.querySelectorAll("a.btn.btn-primary");
          for (const button of buttons) {
            if (button.textContent.trim() === "Daftar Kontrak") {
              button.click();
              break;
            }
          }
        }),
      ]);

      const noKontrak = await page.evaluate(() => {
        return (
          document.querySelector(
            "table.table-condensed.table-striped tbody tr td:nth-child(1)"
          )?.innerText || "Kontrak tidak tersedia"
        );
      });

      console.log(`No. Kontrak: ${noKontrak}`);

      return noKontrak;
    } else {
      console.log('Button "Daftar Kontrak" is not visible yet.');
      return null;
    }
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log('Button "Daftar Kontrak" is not visible yet.');
      return null;
    } else {
      console.error("Error checking for 'Daftar Kontrak' button:", error);
      return null;
    }
  }
}

// New function to concatenate outputs
export async function combineOutputs(page) {
  try {
    const informasiData = await logInformasiUtamaPemesanPPK(page);
    const noKontrak = await logInformasiDaftarKontrak(page);

    // Combine the data
    const combinedOutput = {
      informasiUtama: informasiData.informasiUtama,
      ppk: informasiData.ppk,
      noKontrak: noKontrak,
    };

    console.log("Combined Output:", combinedOutput);

    return combinedOutput;
  } catch (error) {
    console.error("Error combining outputs:", error);
  }
}
