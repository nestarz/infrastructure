const fs = require("fs");
const assert = require("assert");
const colors = require("colors");
const { getChildUrls, getImages, replaceLinks } = require("/app/src/get-urls");
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
  const gotoconf = { waitUntil: "networkidle0", timeout: 30000 };
  const cp_placeholder = fs.readFileSync(
    "/app/assets/cp-placeholder.base64",
    "utf8"
  );
  return {
    async run() {
      const page = await browser.newPage();
      const ressourcepage = await browser.newPage();
      await page.setRequestInterception(true);
      await page.setViewport({ width: 800, height: 600 });
      await ressourcepage.setViewport({ width: 100, height: 100 });
      while (stack.length) {
        const point = stack.pop();
        const url = point.get("url");
        const host = getHost(url);
        visited.push(host);
        page.removeAllListeners();
        page.on("request", request => {
          const allow = ["document", "stylesheet", "font", "image"];
          if (allow.includes(request.resourceType())) request.continue();
          else request.abort();
        });
        const res = await page.goto(url, gotoconf).catch(showerror(url));
        if (res) {
          console.log(colors.green("ok"), url);
          const images = await getImages(page);
          for (const src of images) {
            await timeout(500);
            await ressourcepage.goto(src).catch(showerror(src));
            const base64 = await ressourcepage.screenshot({
              encoding: "base64"
            });
            const { result: pred, error } = await request_client({
              method: "POST",
              uri: "http://node:8080/nsfw",
              body: ["data:image/png;base64," + base64],
              json: true,
              timeout: 2000
            }).catch(showerror(src));
            if (error) continue;
            if (pred.Neutral < 0.8 || pred.Porn + pred.Sexy > 0.2) {
              await replaceLinks(page, src, cp_placeholder);
              console.log(colors.yellow("nsfw detected"), src);
            }
            console.log(colors.green("sfw"), src);
          }
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
  const instances = 5;
  const items = chunks(shuffle(require("/app/assets/links.json")), instances);
  [...Array(instances).keys()].map(index =>
    Crawler(browser, items[index], dir).run()
  );
};

main();
