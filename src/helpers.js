const googleSearch = async (browser, search) => {
  const page = await browser.newPage();
  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(search)}`
  );

  return page;
};

module.exports = { googleSearch };
