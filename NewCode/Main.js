import puppeteer from "puppeteer";
import {
  username,
  password,
  LoginPageLKPP,
  paketbaruPage,
  user_email_mailer,
  password_email_mailer,
  receiver_testing_email,
  receiver_testing_email_2,
  receiver_testing_email_3,
  receiver_testing_email_4,
} from "../config.js";
import { logTableLinks, processTableLinks } from "./StatusPaket.js";
import {
  insertData,
  updateData,
  checkExistingData,
  closeConnection,
} from "./setupSQL.js";
import nodemailer from "nodemailer";
import cron from "node-cron";

// Function to find new elements in the tableNegoResult
const findNewElements = (existingData, newData) => {
  if (!existingData || !existingData.tableNegoResult) {
    console.log("No existing data found, no new elements to report.");
    return []; // Return an empty array if no existing data
  }

  const existingRevisi = existingData.tableNegoResult.map(
    (item) => item.revisi
  );
  const newElements = newData.filter(
    (item) => !existingRevisi.includes(item.revisi)
  );

  console.log(`New elements detected: ${JSON.stringify(newElements, null, 2)}`);
  return newElements;
};

// Function to send a notification email
const sendNotificationEmail = async (ID_Paket, newElements) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user_email_mailer,
      pass: password_email_mailer,
    },
  });

  // Get the last element from newElements array
  const lastElement = newElements[newElements.length - 1];

  const newElementsText = `Revisi: ${lastElement.revisi}, Oleh: ${lastElement.oleh}, Total Harga: ${lastElement.totalHarga}`;

  const mailOptions = {
    from: user_email_mailer,
    to: [
      receiver_testing_email,
      receiver_testing_email_2,
      receiver_testing_email_3,
      receiver_testing_email_4,
    ],
    subject: `Paket ${ID_Paket} terdapat perubahan data pada tabel negosiasi`,
    text: `Paket ${ID_Paket} terdapat perubahan data pada tabel negosiasi.\n\nLast Element:\n${newElementsText}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent for Paket ${ID_Paket}`);
  } catch (error) {
    console.error("Error sending notification email:", error);
  }
};

const scrapAll = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(LoginPageLKPP, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".tab-content");
    console.log("got it!");

    await page.waitForSelector("#formLoginPenyedia");
    console.log("got the element of form login");

    await page.waitForSelector('.input-login[name="username"]');
    await page.type('.input-login[name="username"]', username);
    await page.waitForSelector('.input-login[name="password"]');
    await page.type('.input-login[name="password"]', password);
    await page.waitForSelector("#btnLoginPenyedia");
    await page.click("#btnLoginPenyedia");
    await page.waitForSelector(".main-wrapper", {
      waitUntil: "domcontentloaded",
    });
    console.log("Menu is shown successfully, login succeeded!");

    await page.goto(paketbaruPage, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".col-md-12");

    await new Promise((resolve) => setTimeout(resolve, 8000));
    let allLinks = [];
    let currentPage = 1;
    const totalPages = 2;

    while (currentPage <= totalPages) {
      const pageLinks = await logTableLinks(page);
      allLinks = allLinks.concat(pageLinks);

      if (currentPage < totalPages) {
        await page.click(".pagination li:nth-child(4) a");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await page.waitForSelector(".col-md-12", {
          waitUntil: "domcontentloaded",
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        currentPage++;
      } else {
        break;
      }
    }

    if (allLinks.length > 0) {
      const results = await processTableLinks(page, allLinks);

      for (const result of results) {
        const { Url_Paket, Status_Paket, ID_Paket, tableNegoResult } = result;

        console.log(
          `Scraped data for Paket ${ID_Paket}:`,
          JSON.stringify(result, null, 2)
        );

        const existingData = await checkExistingData(ID_Paket);
        console.log(
          `Existing data for Paket ${ID_Paket}:`,
          JSON.stringify(existingData, null, 2)
        );

        if (existingData) {
          const newElements = findNewElements(existingData, tableNegoResult);
          if (newElements.length > 0) {
            await updateData(
              ID_Paket,
              Status_Paket,
              Url_Paket,
              tableNegoResult
            );
            await sendNotificationEmail(ID_Paket, newElements);
          } else {
            console.log(
              `No new elements detected for Paket ${ID_Paket}, skipping update.`
            );
          }
        } else {
          await insertData(ID_Paket, Status_Paket, Url_Paket, tableNegoResult);
          console.log(`Inserted new record for Paket ${ID_Paket}`);
        }
      }
    } else {
      console.log("No links found to process.");
    }
  } catch (error) {
    console.error("Error during the scraping process:", error);
  } finally {
    await browser.close();
  }
};

cron.schedule("0 */3 * * *", async () => {
  console.log("Running scheduled task");
  try {
    await scrapAll();
  } catch (error) {
    console.error("Error during scheduled task:", error);
  }
});

// Start the initial scraping process
scrapAll();
