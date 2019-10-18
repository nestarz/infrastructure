const levenshtein = require("js-levenshtein");
const { sameHostname } = require("/app/src/utils.js");

const unfollow = ["https:", "#", "?"];

const replaceLinks = async (page, oldurl, newurl) => {
  return await page.$$eval(
    "a",
    (links, { oldurl, newurl }) => {
      links.forEach(
        link => (link.href = link.href === oldurl ? newurl : link.href)
      );
    },
    { oldurl, newurl }
  );
};

const getLinks = async page =>
  (await page.$$eval("a", links => {
    return links.map(link => link.href);
  }))
    .filter(url => url.indexOf(".onion") > -1)
    .filter(url => !unfollow.some(x => url.indexOf(x) !== -1));

const getImages = async page =>
  (await page.$$eval("img", links => {
    return links.map(link => link.src);
  })).filter(url => url.indexOf(".onion") > -1);

const set = arr => [...new Set(arr)];

const getChildUrls = async (page, depth = 3) => {
  const url = page.url();
  const indexurls = await getLinks(page);
  const sources = indexurls
    .filter(childurl => sameHostname(url, childurl))
    .slice(0, depth);
  let childs = [];
  for (const childurl of sources) {
    await goto(page, childurl);
    const links = (await getLinks(page)).filter(child =>
      sameHostname(url, child)
    );
    childs = [...childs, ...links];
  }
  const urls = set([...indexurls, ...childs]);
  return urls.sort((a, b) => levenshtein(a, url) > levenshtein(b, url));
};

module.exports = { getChildUrls, getImages, replaceLinks };
