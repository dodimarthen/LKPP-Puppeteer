const puppeteer = require('puppeteer');
const { websiteURL } = require('./config.js');


const getQuotes = async () => {
    // Record the start time
    const startTime = new Date();

    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    // Open a new page
    console.log("Opening the browser..")
    const page = await browser.newPage();
  
    // On this new page:
    // - open the "http://quotes.toscrape.com/" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto(websiteURL, {
      waitUntil: "domcontentloaded",
    });
  
    // Get page data
    console.log("scrap the data")
    const quotes = await page.evaluate(() => {
      // Fetch the first element with class "quote"
      // Get the displayed text and returns it
      const quoteList = document.querySelectorAll(".quote");
  
      // Convert the quoteList to an iterable array
      // For each quote fetch the text and author
      return Array.from(quoteList).map((quote) => {
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
  
        return { text, author };
      });
    });
  
    // Display the quotes
    console.log("Print the data....")
    console.log(quotes);

    // Calculate the process time
    const endTime = new Date();
    const processTime = (endTime - startTime) / 1000;
  
    // Display the process time
    console.log("Process time:", processTime, "seconds");
  
    // Close the browser
    console.log("Close the browser..")
    await browser.close();
};

// Start the scraping
getQuotes();
