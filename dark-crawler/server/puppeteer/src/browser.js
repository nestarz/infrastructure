const puppeteer = require("puppeteer");
const fs = require("fs");
const { sensitiveContent } = require("/app/src/utils");
const { showerror } = require("/app/src/utils");

const cache = {
  ___value: {},
  get(key) {
    return this.___value[key];
  },
  set(key, value) {
    this.___value[key] = value;
  }
};

const connect = async () =>
  await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--proxy-server=socks5://tor:9150",
      // "--disable-infobars",
      // "--window-position=0,0",
      // "--ignore-certifcate-errors",
      // "--ignore-certifcate-errors-spki-list",
      // "--disable-dev-shm-usage",
      // "--disable-accelerated-2d-canvas",
      // "--disable-gpu",
      // "--hide-scrollbars",
      // "--single-process",
      // "--no-sandbox",
      // "--disable-setuid-sandbox",
      // "--disable-canvas-aa", // Disable antialiasing on 2d canvas
      // "--disable-2d-canvas-clip-aa", // Disable antialiasing on 2d canvas clips
      // "--disable-gl-drawing-for-tests", // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
      // "--disable-dev-shm-usage", // ???
      // "--no-zygote", // wtf does that mean ?
      // "--use-gl=swiftshader", // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
      // "--enable-webgl",
      // "--hide-scrollbars",
      // "--mute-audio",
      // "--no-first-run",
      // "--disable-infobars",
      // "--disable-breakpad",
      // "--ignore-gpu-blacklist"
    ]
  });

const screenshot = async (page, url) => {
  if (page.url() !== url) {
    page.goto(url);
  }

  await page.screenshot({ path: `${dir}/${name}.png` });
  await page.screenshot({ path: `${dir}/latest.png` });
};

const goto = async (page, url) => {
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 20000
  });
};

const replaceNSFW = async (request, page, point) => {
  const cp_placeholder = fs.readFileSync(
    "/app/assets/cp-placeholder.base64",
    "utf8"
  );
  const url = request.url();
  const ressourceType = request.resourceType();
  const isOnionImage =
    ressourceType === "image" &&
    url.includes(".onion/") &&
    [".jpg", ".jpeg", ".png", ".webp"].some(ext => url.includes(ext));
  if (
    point.details &&
    point.details.some(x => x.type === "nsfw") &&
    isOnionImage
  ) {
    request.continue({
      url: cp_placeholder
    });
  }

  const rprevious = cache.get(url);
  if (rprevious) {
    return rprevious(request);
  }

  const rabort = args => {
    cache.set(url, r => r.abort(args));
    request.abort(args);
  };
  const rcontinue = args => {
    cache.set(url, r => r.continue(args));
    request.continue(args);
  };

  if (!["document", "stylesheet", "image", "font"].includes(ressourceType)) {
    return rabort();
  }

  if (isOnionImage) {
    const nsfw = await sensitiveContent(url, page).catch(showerror(url));
    if (nsfw && nsfw.status) {
      console.log("nsfw material replaced");
      point.add({ type: "nsfw", confidence: nsfw.confidence });
      return rcontinue({
        url: cp_placeholder
      });
    }
  }
  return rcontinue();
};

module.exports = { screenshot, connect, replaceNSFW, goto };
