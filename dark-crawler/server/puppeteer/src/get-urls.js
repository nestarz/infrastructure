const levenshtein = require("js-levenshtein");
const { sameHostname } = require("/app/src/utils.js");
const cheerio = require("cheerio");

const unfollow = ["https:", "#", "?"];

const replaceLinks = async (page, oldurl, newurl) => {
  return await page.$$eval(
    "img",
    (links, { oldurl, newurl }) => {
      links.forEach(
        link => (link.src = link.src === oldurl ? newurl : link.src)
      );
    },
    { oldurl, newurl }
  );
};

const getLinks = body => {
  const $ = cheerio.load(body);
  const links = $("a"); //jquery get all hyperlinks
  const urls = [];
  $(links).each((i, link) => urls.push($(link).attr("href")));
  urls
    .filter(url => url.indexOf(".onion") > -1)
    .filter(url => !unfollow.some(x => url.indexOf(x) !== -1));
};

const getImages = async raw => {
  const images = [];
  const $ = cheerio.load(raw);
  $("img").each(function() {
    src = $(this).attr("src");
    console.log(src);
    images.push(src);
  });
  return images.filter(url => url.indexOf(".onion") > -1);
};

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
