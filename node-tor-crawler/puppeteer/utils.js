const fs = require("fs");
const puppeteer = require("puppeteer");

const LEVEL = 1;

const logger = {
  log: (level, ...input) => LEVEL > level && console.log(...input),
  error: (level, ...input) => LEVEL > level && console.error(...input),
  warn: (level, ...input) => LEVEL > level && console.warn(...input)
};

const generate_id = (id => () => id++)(0);

const withHttp = url => (!/^https?:\/\//i.test(url) ? `http://${url}` : url);

const getHostname = url => {
  try {
    return new URL(withHttp(url)).hostname;
  } catch (error) {
    return null;
  }
};

const sameHostname = (url1, url2) => getHostname(url1) === getHostname(url2);

const isOnionURL = url =>
  getHostname(url) && getHostname(url).endsWith(".onion");

const shuffle = array =>
  array
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const random = array => array[Math.floor(Math.random() * array.length)];

const mkdir = path =>
  !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });

const connect = async () =>
  await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--single-process",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=socks5://tor:9150`,
      "--disable-canvas-aa", // Disable antialiasing on 2d canvas
      "--disable-2d-canvas-clip-aa", // Disable antialiasing on 2d canvas clips
      "--disable-gl-drawing-for-tests", // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
      "--disable-dev-shm-usage", // ???
      "--no-zygote", // wtf does that mean ?
      "--use-gl=swiftshader", // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
      "--enable-webgl",
      "--hide-scrollbars",
      "--mute-audio",
      "--no-first-run",
      "--disable-infobars",
      "--disable-breakpad",
      //'--ignore-gpu-blacklist',
      "--window-size=1280,1024", // see defaultViewport
      "--no-sandbox", // meh but better resource comsuption
      "--disable-setuid-sandbox"
    ]
  });

const goto = async (page, url) => {
  // logger.log(0, "goto...");
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 30000
  });
};

const newPage = async (browser, { eventRequestAbort }) => {
  logger.log(0, "new page...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });

  await page.setRequestInterception(true);
  await page.evaluateOnNewDocument(() => {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `img {
      filter: blur(5px);
  }`; // the css content goes here
    document.getElementsByTagName("head")[0].appendChild(style);
    console.log("LOL");
  });
  page.on("request", request => {
    const ressourceType = request.resourceType();
    if (!["document", "stylesheet", "image", "font"].includes(ressourceType)) {
      eventRequestAbort(ressourceType);
      request.abort();
    } else request.continue();
  });

  return page;
};

const screenshot = async (page, name, dir) => {
  logger.log(0, "screenshot...");
  await page.screenshot({ path: `${dir}/${name}.png` });
  await page.screenshot({ path: `${dir}/latest.png` });
};

const getLinks = async page =>
  await page.$$eval("a", links => {
    return links.map(link => link.href);
  });

const allblacklist = [];
const getExternalSiteLinks = async (
  page,
  { hostblacklist = [], dir },
  depth = 0
) => {
  // logger.log(0, "evaliuating links...", depth);
  const links = shuffle(
    (await getLinks(page))
      .filter(isOnionURL)
      .filter(
        link =>
          !hostblacklist.includes(getHostname(link)) &&
          !allblacklist.includes(link)
      )
  );

  const internal = links
    .filter(link => sameHostname(link, page.url()))
    .slice(0, 3);
  const external = links.filter(link => !sameHostname(link, page.url()));

  let subexternal = [];
  if (depth === 0)
    console.log(
      `starting with ${external.length + subexternal.length} externals and ${
        internal.length
      } internals`
    );

  let error = false;
  if (depth < 2) {
    for (const link of internal) {
      try {
        await goto(page, link);
        await blurSensitiveContent(page);
        await page.screenshot({ path: `${dir}/latest.png` });
        allblacklist.push(link);
        subexternal = [
          ...subexternal,
          await getExternalSiteLinks(page, { hostblacklist }, depth + 1)
        ];
        if (depth === 0)
          console.log(
            `discovered ${subexternal.length} new links. now ${external.length +
              subexternal.length}`
          );
      } catch (error) {
        error = true;
      }
    }
  }

  if (error || depth === 10) {
    allblacklist.push(getHostname(page.url()));
  }
  return [...external, ...subexternal];
};

const save = (value, dir, name) => {
  var filename = `${dir}/${name}`;
  const file = fs.existsSync(filename) ? require(filename) : [];
  const newvalue = [...file, ...value];
  fs.writeFile(filename, JSON.stringify(newvalue), function(err) {
    if (err) return console.log(err);
    // console.log("writing to " + filename);
  });
};

const blurSensitiveContent = async page =>
  page.addStyleTag({ content: "img {filter: blur(15px);}" });

module.exports = {
  blurSensitiveContent,
  withHttp,
  generate_id,
  shuffle,
  mkdir,
  connect,
  goto,
  screenshot,
  getExternalSiteLinks,
  newPage,
  save,
  getHostname,
  random
};
