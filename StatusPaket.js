import { json } from "express";
import { TableNego } from "./HargaNegosiasi.js";

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
              Status_Paket === "Proses kontrak ppk")
          ) {
            return { Url_Paket, Status_Paket, ID_Paket };
          }
          return null;
        })
        .filter((item) => item !== null);
    });

    data.forEach((item) => {
      console.log(item.Url_Paket);
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
    await page.goto(item.Url_Paket);
    const tableNegoResult = await TableNego(page);
    const pairedResult = { ...item, tableNegoResult };
    results.push(pairedResult);
    console.log(pairedResult);
  }

  return results;
}
