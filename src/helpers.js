const googleSearch = async (browser, search) => {
  const page = await browser.newPage();
  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(search)}`
  );

  return page;
};

const delay = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

module.exports = { googleSearch, delay };
