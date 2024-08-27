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

      // Extract and log "No. Kontrak" only
      const noKontrak = await page.evaluate(() => {
        return (
          document.querySelector(
            "table.table-condensed.table-striped tbody tr td:nth-child(1)"
          )?.innerText || "Kontrak tidak tersedia"
        );
      });

      console.log(`No. Kontrak: ${noKontrak}`);
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
