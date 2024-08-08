export async function logInformasiDaftarKontrak(page) {
  try {
    // Wait for the button to be visible
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

      // Click the button and wait for navigation to complete
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }), // Adjust waitUntil based on your needs
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

      // Extract and log "No. Kontrak" and "Tanggal Kontrak"
      const contractInfo = await page.evaluate(() => {
        const noKontrak =
          document.querySelector(
            "table.table-condensed.table-striped tbody tr td:nth-child(1)"
          )?.innerText || "Not available";
        const tanggalKontrak =
          document.querySelector(
            "table.table-condensed.table-striped tbody tr td:nth-child(2)"
          )?.innerText || "Not available";
        return { noKontrak, tanggalKontrak };
      });

      console.log(`No. Kontrak: ${contractInfo.noKontrak}`);
      console.log(`Tanggal Kontrak: ${contractInfo.tanggalKontrak}`);
    } else {
      console.log('Button "Daftar Kontrak" is not visible yet.');
    }
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log('Button "Daftar Kontrak" is not visible yet.');
    } else {
      console.error("Error checking for 'Daftar Kontrak' button:", error);
    }
  }
}
