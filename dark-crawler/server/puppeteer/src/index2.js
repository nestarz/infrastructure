const fs = require("fs");
const assert = require("assert");
const colors = require("colors");
const { getChildUrls } = require("/app/src/get-urls");
const { connect } = require("/app/src/browser");
const { ID, getHost, showerror, getExt } = require("/app/src/utils");
const { withHttp, shuffle, chunks, mkdir, rmdir } = require("/app/src/utils");
const { withTimeout, timeout } = require("/app/src/utils");
const request_client = require("request-promise-native");

process.setMaxListeners(Infinity); // <== Important line

let logStream;
const Point = (url, instance) => {
  assert(typeof url === "string", Error(`url not valid ${url}`));
  const value = {
    url: withHttp(url),
    instance
  };
  return {
    get(key) {
      return value[key];
    },
    add(data) {
      value.details = {
        ...data
      };
    },
    save(dir) {
      const filename = `${dir}/tree.jsonl`;
      logStream = logStream || fs.createWriteStream(filename, { flags: "a" });
      logStream.write(JSON.stringify(value));
      logStream.write("\n");
    }
  };
};

const Crawler = (browser, items, dir) => {
  const id = ID();
  const InstancePoint = url => Point(url, id);
  let stack = items.map(InstancePoint);
  const visited = [];
  const gotoconf = { waitUntil: "networkidle0", timeout: 120000 };
  const cp_placeholder = fs.readFileSync(
    "/app/assets/cp-placeholder.base64",
    "utf8"
  );
  return {
    async run() {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      await page.setViewport({ width: 1280, height: 800 });
      while (stack.length) {
        const point = stack.pop();
        const url = point.get("url");
        const host = getHost(url);
        visited.push(host);
        page.removeAllListeners();
        const sfw = [];
        page.on("request", async request => {
          const allow = ["document", "stylesheet", "font", "image"];
          const type = request.resourceType();
          const url = request.url();
          const ext = getExt(url);
          const isAllowed = allow.includes(type);
          const isOnion = url.includes(".onion");
          const isImage = ["jpg", "png", "jpeg"].includes(ext);
          if (isImage && isOnion && sfw.length > 5) {
            console.log(colors.blue("Enough SFW, not classifing "), url);
            request.continue();
          } else if (isImage && isOnion) {
            await timeout(Math.random() * 5000);
            withTimeout(
              10000,
              request_client({
                method: "POST",
                uri: "http://node:8080/nsfw",
                body: [url],
                json: true,
                timeout: 10000
              })
            )
              .then(({ data: pred }) => {
                console.log(colors.yellow(pred.Porn), url);
                if (pred.Porn > 0.2) {
                  console.log(colors.blue("NSFW"), url);
                  request.continue({
                    url: cp_placeholder
                  });
                } else {
                  sfw.push(url);
                  request.continue();
                }
              })
              .catch(err => request.abort() && showerror(url)(err));
            }
          else if (isAllowed) request.continue();
          else request.abort();
        });
        const res = await page.goto(url, gotoconf).catch(showerror(url));
        if (res) {
          console.log(colors.green("ok"), url);
          await page.screenshot({ path: `${dir}/${host}.png` });
          await page.screenshot({ path: "/output/latest.png" });
          point.save(dir);
          const urls = []; // await getChildUrls(page, 0);
          const unvisited = urls.filter(l => !visited.includes(getHost(l)));
          const points = unvisited.map(InstancePoint);
          stack = [...stack.filter(l => !unvisited.includes(l.url)), ...points];
        }
      }
      console.log(colors.yellow("finished"), id);
    }
  };
};

let browser;
process.on("SIGINT", () => {
  console.log(colors.yellow("quitting..."));
  browser.close();
  process.exit();
});
const main = async () => {
  const dir = `/output/latest`; // `/output/${Date.now()}`;
  rmdir(dir);
  mkdir(dir);
  browser = await connect();
  const instances = 10;
  const items = chunks(shuffle(require("/app/assets/links.json")), instances);
  [...Array(instances).keys()].map(index =>
    Crawler(browser, items[index], dir).run()
  );
};

main();
