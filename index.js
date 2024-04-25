const data = require("./data");
const {pageURL} = data;

const scraping = require('./WebScraping');
const compareAndSaveResults = require('./resultAnalysis');

scraping(pageURL)
    .then(combinedData => {
        compareAndSaveResults(combinedData);
    })
    .catch(console.error);