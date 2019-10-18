const { ID, withHttp, shuffle, chunks, getHost } = require("/app/src/utils");
const { getChildUrls, getBody } = require("/app/src/get-urls");
const { connect, newPage } = require("/app/src/browser");
const assert = require("assert");

const Point = (url, instance) => {
  assert(typeof url === "string", Error(`url not valid ${url}`));
  return {
    url: withHttp(url),
    instance
  };
};

const Crawler = (browser, items) => {
  const id = ID();
  const InstancePoint = url => Point(url, id);
  let stack = items.map(InstancePoint);
  const visited = [];
  return {
    async run() {
      const page = await newPage(browser);
      while (stack.length) {
        const { url } = stack.pop();
        visited.push(getHost(url));
        const body = await getBody(url);
        if (body) {
          await page.goto(url);
          await page.screenshot({ path: "/output/latest.png" });
          const urls = await getChildUrls(body, url);
          const unvisited = urls.filter(l => !visited.includes(getHost(l)));
          const points = unvisited.map(InstancePoint);
          stack = [
            ...stack.filter(({ url }) => unvisited.includes(url)),
            ...points
          ];
        }
      }
    }
  };
};

const main = async () => {
  const instances = 5;
  const browser = await connect();
  const items = chunks(shuffle(require("/app/assets/links.json")), instances);
  [...Array(instances).keys()].map(index =>
    Crawler(browser, items[index]).run()
  );
};

main();
