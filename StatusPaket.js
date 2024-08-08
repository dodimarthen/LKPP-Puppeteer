import { logInformasiUtamaPemesanPPK } from "./MainPage.js";
import { logInformasiDaftarKontrak } from "./packageKontrak.js";
import { TableNego } from "./HargaNegosiasi.js";

export async function logTableLinks(page) {
  try {
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("tbody tr");
      return Array.prototype.map
        .call(rows, (row) => {
          const anchor = row.querySelector("a[href*='detail']");
          const href = anchor ? anchor.href : null;
          const td11 = row.cells[12] ? row.cells[12].innerText.trim() : null;

          if (
            href &&
            (td11 === "Proses negosiasi" || td11 === "Proses kontrak ppk")
          ) {
            return { href, td11 };
          }

          return null;
        })
        .filter((item) => item !== null);
    });
    for (const item of data) {
      console.log(item);
      await page.goto(item.href);
      // await logInformasiUtamaPemesanPPK(page);
      // await logInformasiDaftarKontrak(page);
      await TableNego(page);
    }
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
