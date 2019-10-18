const fs = require("fs");
const colors = require("colors");
const request_client = require("request-promise-native");

const LEVEL = 1;

const remove_duplicates = arr => {
  const s = new Set(arr);
  const it = s.values();
  return Array.from(it);
};

const get_url_extension = url =>
  url
    .split(/\#|\?/)[0]
    .split(".")
    .pop()
    .trim();

const logger = {
  log: (level, ...input) => LEVEL > level && console.log(...input),
  error: (level, ...input) => LEVEL > level && console.error(...input),
  warn: (level, ...input) => LEVEL > level && console.warn(...input)
};

const ID = (id => () => id++)(0);

const withHttp = url => (!/^https?:\/\//i.test(url) ? `http://${url}` : url);

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const getHost = url => {
  try {
    return new URL(withHttp(url)).hostname;
  } catch (error) {
    return null;
  }
};

const sameHostname = (url1, url2) => getHost(url1) === getHost(url2);

const isOnionURL = url => getHost(url) && getHost(url).endsWith(".onion");

const shuffle = array =>
  array
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const chunks = (array, parts) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.slice(0, Math.ceil(array.length / i)));
  }
  return result;
};

const random = array => array[Math.floor(Math.random() * array.length)];

const mkdir = path =>
  !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });

const goto = async (page, url) => {
  logger.log(0, "goto...", url);
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 20000
  });
};

const cache = {
  ___value: {},
  get(key) {
    return this.___value[key];
  },
  set(key, value) {
    this.___value[key] = value;
  }
};
const newPage = async (browser, { eventRequestAbort }) => {
  logger.log(0, "new page...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });

  await page.setRequestInterception(true);
  page.on("request", async request => {
    const ressourceType = request.resourceType();
    const url = request.url();
    const rprevious = cache.get(url);
    if (rprevious) {
      console.log("previous r");
      return rprevious();
    }

    const rabort = args => {
      cache.set(url, () => request.abort(args));
      request.abort(args);
    };
    const rcontinue = args => {
      cache.set(url, () => request.continue(args));
      request.continue(args);
    };

    if (!["document", "stylesheet", "image", "font"].includes(ressourceType)) {
      return rabort();
    }

    if (
      ressourceType === "image" &&
      url.includes(".onion/") &&
      [".jpg", ".jpeg", ".png", ".webp"].some(ext => url.includes(ext))
    ) {
      const nsfw = await sensitiveContent(url);
      if (nsfw.status) {
        console.log("nsfw material replaced");
        eventRequestAbort({ type: "nsfw", confidence: nsfw.confidence });
        return rcontinue({
          url: cp_placeholder
        });
      }
    }
    return rcontinue();
  });

  return page;
};

const sensitiveContent = async (url, browser) => {
  let base64;
  try {
    const imagedlpage = await browser.newPage();
    const source = await imagedlpage.goto(url);
    base64 = (await source.buffer()).toString("base64");
    await imagedlpage.close();
  } catch (error) {
    console.log(
      "downloading image error",
      colors.red(error.toString().slice(0, 180))
    );
    return { status: false };
  }

  const type = get_url_extension(url);
  const prefix = "data:" + type + ";base64,";
  const data = prefix + base64;
  
  const { result: predictions, error } = await request_client({
    method: "POST",
    uri: "http://node:8080/nsfw",
    body: [data],
    json: true,
    timeout: 2000
  });

  if (
    !error &&
    ((predictions.Neutral > 0.8 && predictions.Porn > 0.2) ||
      predictions.Sexy > 0.2)
  ) {
    return { status: true, confidence: predictions.Porn };
  }

  return { status: false };
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
          !hostblacklist.includes(getHost(link)) && !allblacklist.includes(link)
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
    allblacklist.push(getHost(page.url()));
  }
  return [...external, ...subexternal];
};

let logStream;
const save = (value, dir, name) => {
  const filename = `${dir}/${name}`;
  logStream = logStream || fs.createWriteStream(filename, { flags: "a" });
  logStream.write(JSON.stringify(value));
  logStream.write("\n");
};

const withTimeout = (millis, promise) => {
  const timeout = new Promise((resolve, reject) =>
    setTimeout(() => reject(`Timed out after ${millis} ms.`), millis)
  );
  return Promise.race([promise, timeout]);
};

module.exports = {
  withTimeout,
  withHttp,
  ID,
  shuffle,
  chunks,
  mkdir,
  goto,
  screenshot,
  getExternalSiteLinks,
  newPage,
  save,
  getHost,
  random,
  sameHostname,
  sensitiveContent,
  remove_duplicates
};
