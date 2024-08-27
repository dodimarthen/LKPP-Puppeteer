import { TableNego } from "./HargaNegosiasi.js";
import { combineOutputs, logInformasiUtamaPemesanPPK } from "./MainPage.js";
import { logInformasiDaftarKontrak } from "./packageKontrak.js";
import { insertDataiuppk } from "./setupSQL_2.js";

// Function to log table links
export async function logTableLinks(page) {
  try {
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("tbody tr");
      return Array.from(rows)
        .map((row) => {
          const anchor = row.querySelector("a[href*='detail']");
          const Url_Paket = anchor ? anchor.href : null;
          const Status_Paket = row.cells[12]
            ? row.cells[12].innerText.trim()
            : null;
          const ID_Paket = anchor
            ? anchor.querySelector("strong")?.innerText.trim()
            : null;

          if (
            Url_Paket &&
            (Status_Paket === "Proses negosiasi" ||
              Status_Paket === "Mengirimkan ke ppk" ||
              Status_Paket === "Proses kontrak ppk")
          ) {
            return { Url_Paket, Status_Paket, ID_Paket };
          }
          return null;
        })
        .filter((item) => item !== null);
    });

    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}

// Separate function to process each item
export async function processTableLinks(page, data) {
  const results = [];

  for (const item of data) {
    if (item.Status_Paket === "Proses kontrak ppk") {
      await loginformasiutamappk(page, item.Url_Paket);
    } else {
      // Handle other statuses
      await page.goto(item.Url_Paket);
      const tableNegoResult = await TableNego(page);
      const pairedResult = { ...item, tableNegoResult };
      results.push(pairedResult);
      console.log(pairedResult);
    }
  }

  return results;
}

// Function to handle informasi utama and Proses kontrak ppk status
export async function loginformasiutamappk(page, url) {
  try {
    await page.goto(url);
    console.log(`Processing Proses kontrak ppk at ${url}`);

    const scrapedData = await combineOutputs(page);
    if (scrapedData) {
      await insertDataiuppk(scrapedData);
    }
  } catch (error) {
    console.error(`Error processing Proses kontrak ppk: ${error.message}`);
  }
}
