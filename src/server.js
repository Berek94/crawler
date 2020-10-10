const express = require("express");
const puppeteer = require("puppeteer");
const { googleSearch, delay } = require("./helpers");

const startSever = ({ port }) => {
  const server = express();

  server.get("/currency", async (req, res) => {
    try {
      const browser = await puppeteer.launch();
      const getCurrencyValue = (page) =>
        page.evaluate(() => {
          const node = document.querySelector(
            "div[data-exchange-rate] span[data-value]"
          );
          return node && node.textContent;
        });

      let page = await googleSearch(browser, "курс доллара");
      const usd = await getCurrencyValue(page);
      page = await googleSearch(browser, "курс евро");
      const eur = await getCurrencyValue(page);

      browser.close();

      res.json({ usd, eur });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  server.get("/tweets", async (req, res) => {
    try {
      const width = 400;
      const height = 1000;
      const browser = await puppeteer.launch({
        args: [`--window-size=${width},${height}`],
      });
      const page = await browser.newPage();
      await page.setViewport({
        width,
        height,
      });

      await page.goto("https://twitter.com/_drugoy_");
      await page.waitForSelector('[data-testid="tweet"]');

      const data = await page.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll(
            'div[data-testid="tweet"] > div:last-child > div:last-child > div:first-child [lang="ru"]'
          ),
        ];
        return nodes.map((node) => node.textContent).slice(0, 10);
      });

      browser.close();

      res.json(data);
    } catch (error) {}
  });

  server.listen(port, () => {
    console.log(`Crawler server started on port ${port}`);
  });
};

module.exports = startSever;
