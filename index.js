const puppeteer = require('puppeteer');
const { websiteURL, username, password } = require('./config.js');

const getQuotes = async () => {
  // Record the start time
  const startTime = new Date();

  // Start a Puppeteer session:
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  console.log("Opening the browser..")
  const page = await browser.newPage();
  await page.goto(websiteURL, {
    waitUntil: "domcontentloaded",
  });

  //Login
  await page.waitForSelector('.input-login[name="username"]');
  await page.type('.input-login[name="username"]', username);
  await page.waitForSelector('.input-login[name="password"]');
  await page.type('.input-login[name="password"]', password);
  await page.waitForSelector('#btnLoginPenyedia');
  await page.click('#btnLoginPenyedia');
  await page.waitForSelector('.modal-header h4');
  const headerText = await page.evaluate(() => {
    return document.querySelector('.modal-header h4').textContent;
  });
  console.log(headerText);
  
  
  
  // Close the browser
  console.log("Close the browser..")
  await browser.close();
  
  // Calculate the process time
  const endTime = new Date();
  const processTime = (endTime - startTime) / 1000;

  // Display the process time
  console.log("Process time:", processTime, "seconds");

};

// Start the scraping
getQuotes();
