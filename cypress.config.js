const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.saucedemo.com/",
    watchForFileChanges : false,
    defaultCommandTimeout : 15000,
    responseTimeout : 15000,
    resquestTimeout : 15000,
    pageLoadTimeout : 15000,
  },
});
