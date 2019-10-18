const puppeteer = require("puppeteer");
const fs = require("fs");
const { sensitiveContent } = require("/app/src/utils");

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
      "--no-sandbox", // meh but better resource comsuption
      "--disable-setuid-sandbox"
    ]
  });

const screenshot = async (page, url) => {
  if (page.url() !== url) {
    page.goto(url);
  }

  await page.screenshot({ path: `${dir}/${name}.png` });
  await page.screenshot({ path: `${dir}/latest.png` });
};

const newPage = async (browser, eventRequestAbort = () => null) => {
  const cp_placeholder = fs.readFileSync(
    "/app/assets/cp-placeholder.base64",
    "utf8"
  );
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });

  await page.setRequestInterception(true);
  page.on("request", async request => {
    const ressourceType = request.resourceType();
    const url = request.url();
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

    // if (
    //   ressourceType === "image" &&
    //   url.includes(".onion/") &&
    //   [".jpg", ".jpeg", ".png", ".webp"].some(ext => url.includes(ext))
    // ) {
    //   const nsfw = await sensitiveContent(url, browser);
    //   if (nsfw.status) {
    //     console.log("nsfw material replaced");
    //     eventRequestAbort({ type: "nsfw", confidence: nsfw.confidence });
    //     return rcontinue({
    //       url: cp_placeholder
    //     });
    //   }
    // }
    return rcontinue();
  });

  return page;
};

module.exports = { screenshot, connect, newPage };
