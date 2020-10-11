const express = require("express");
const puppeteer = require("puppeteer");
const { googleSearch } = require("./helpers");

const startSever = ({ port }) => {
  const server = express();

  server.get("/currency", async (req, res) => {
    try {
      const browser = await puppeteer.launch();
      const currencySelector = "div[data-exchange-rate] span[data-value]";

      const getCurrencyValue = (page) =>
        page.evaluate(() => {
          const node = document.querySelector("div[data-exchange-rate] span[data-value]");
          return node && node.textContent;
        });

      let page = await googleSearch(browser, "курс доллара");
      await page.waitForSelector(currencySelector, {
        timeout: 5000,
      });
      const usd = await getCurrencyValue(page);
      await page.close();

      page = await googleSearch(browser, "курс евро");
      await page.waitForSelector(currencySelector, {
        timeout: 5000,
      });
      const eur = await getCurrencyValue(page);

      await browser.close();

      if (usd && eur) {
        res.json({ usd, eur });
      } else {
        throw new Error("Ошибка");
      }
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
      await page.waitForSelector('[data-testid="tweet"]', {
        timeout: 5000,
      });

      const data = await page.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll(
            'div[data-testid="tweet"] > div:last-child > div:last-child > div:first-child [lang="ru"]'
          ),
        ];
        return nodes.map((node) => node.textContent).slice(0, 10);
      });

      await browser.close();

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  server.listen(port, () => {
    console.log(`Crawler server started on port ${port}`);
  });
};

module.exports = startSever;
