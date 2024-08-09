import { TableNego } from "./HargaNegosiasi.js";

export async function logTableLinks(page) {
  try {
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("tbody tr");
      return Array.from(rows)
        .map((row) => {
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

    data.forEach((item) => {
      console.log(item.href);
    });
    const results = [];

    for (const item of data) {
      await page.goto(item.href);
      const tableNegoResult = await TableNego(page);
      const pairedResult = { ...item, tableNegoResult };
      results.push(pairedResult);
      console.log(pairedResult);
    }

    return results;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
