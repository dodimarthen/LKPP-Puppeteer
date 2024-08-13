export async function TableNego(page) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 7000));

    await page.waitForSelector(".panel-body .detail-list");

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        ".panel-body .detail-list .detail-item .row"
      );
      const result = [];
      rows.forEach((row) => {
        const revisi = row.querySelector(".col-md-2")
          ? row.querySelector(".col-md-2").innerText.trim()
          : null;
        const oleh = row.querySelector(".col-md-6")
          ? row.querySelector(".col-md-6").innerText.trim()
          : null;
        const totalHarga = row.querySelector(".col-md-3 div")
          ? row.querySelector(".col-md-3 div").innerText.trim()
          : null;
        if (revisi && oleh && totalHarga) {
          result.push({ revisi, oleh, totalHarga });
        }
      });
      return result;
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return null;
  }
}
