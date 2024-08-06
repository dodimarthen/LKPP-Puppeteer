const puppeteer = require("puppeteer-extra");
const {
  websiteURL,
  username,
  password,
  paketbaruPage,
} = require("../config.js");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const fs = require("fs");
const { sendWhatsappMessageToGroup } = require("./IndexWhatsApp");
const Scraping = require("./riwnegotesting.js"); // Import the Scraping function

const LAST_PACKAGE_FILE = "last_package.txt";

async function scrapeAndSendEmail() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(websiteURL, { waitUntil: "networkidle2" });

    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector("#btnLoginPenyedia");
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".modal-header h4");

    await page.goto(paketbaruPage, { waitUntil: "domcontentloaded" });

    console.log("Navigation to Paket Baru successful");
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const packages = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("table#tblPenawaran tbody tr")
      );
      return rows
        .map((row) => {
          const strongElement = row.querySelector("td > a > strong");
          return strongElement ? strongElement.innerText.trim() : null;
        })
        .filter((name) => name);
    });
    console.log("Extracted packages:", packages);

    if (packages.length === 0) {
      console.error("No packages found on the page.");
      return;
    }

    let lastPackage = readLastPackage();
    let latestPackage = packages[0];

    if (!latestPackage) {
      console.error("Latest package is undefined.");
      return;
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dodimarthen.sit@gmail.com",
        pass: "hwbu itbw bfdd bzju",
      },
    });

    if (latestPackage !== lastPackage) {
      writeLastPackage(latestPackage);

      const packageNumber = latestPackage.split("-").pop();
      console.log(`Latest package number: ${packageNumber}`);

      if (!packageNumber) {
        console.error("Package number is undefined.");
        return;
      }

      const dataScrapedRiwayat = await Scraping(packageNumber);
      let mailOptions = {
        from: "dodimarthen.sit@gmail.com",
        to: "dodimartin.sit@gmail.com, yosep@mindotama.co.id, steven98919@gmail.com",
        subject: "Notification For New Paket Baru LKPP E-Catalogue",
        text: `A new package has been posted: ${latestPackage}\n\nRiwayat Negosiasi Produk:\n${JSON.stringify(
          dataScrapedRiwayat,
          null,
          2
        )}`,
      };

      // Send email notification
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Notification email sent: " + info.response);
        }

        // Send WhatsApp notification
        const whatsappMessage = `Terdapat penambahan Paket Baru pada LKPP: ${latestPackage}`;
        try {
          const whatsappResponse = await sendWhatsappMessageToGroup(
            whatsappMessage
          );
          console.log("WhatsApp message sent:", whatsappResponse);
        } catch (whatsappError) {
          console.error("Error sending WhatsApp message:", whatsappError);
        }
      });
    } else {
      console.log("No new packages found.");
    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

function readLastPackage() {
  if (fs.existsSync(LAST_PACKAGE_FILE)) {
    return fs.readFileSync(LAST_PACKAGE_FILE, "utf-8");
  }
  return null;
}

function writeLastPackage(packageName) {
  if (!packageName) {
    console.error("Package name is undefined, cannot write to file.");
    return;
  }
  fs.writeFileSync(LAST_PACKAGE_FILE, packageName, "utf-8");
}

// Schedule the function to run every thirty minutes
schedule.scheduleJob("0 * * * *", async () => {
  console.log("Running the scraper and email sender...");
  await scrapeAndSendEmail();
});

scrapeAndSendEmail();
