const fs = require("fs");
const colors = require("colors");
const request_client = require("request-promise-native");

const LEVEL = 1;

const remove_duplicates = arr => {
  const s = new Set(arr);
  const it = s.values();
  return Array.from(it);
};

const showerror = msg => err =>
  console.log(colors.red(err.toString().slice(0, 180)), msg);

const getExt = url =>
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

const rmdir = path => {
  if (!fs.existsSync(path)) return;
  const files = fs.readdirSync(path);
  files.forEach(element => {
    fs.unlinkSync(path + "/" + element);
  });
  fs.rmdirSync(path);
};

const sensitiveContent = async (url, page, point) => {
  let base64;
  try {
    const source = await page.goto(url);
    base64 = (await source.buffer()).toString("base64");
  } catch (error) {
    console.log(
      "downloading image error",
      colors.red(error.toString().slice(0, 180))
    );
    return { status: false };
  }

  const type = getExt(url);
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
  getExt,
  rmdir,
  getHost,
  random,
  sameHostname,
  sensitiveContent,
  remove_duplicates,
  showerror,
  timeout
};


const removeNsfw = async (url) => {
  await timeout(Math.random() * 100);
  const source = await ressourcepage.goto(url);
  const base64 = (await source.buffer()).toString("base64");
  const prefix = "data:image/" + ext + ";base64,";
  const data = prefix + base64;
  const { result: pred, error } = await request_client({
    method: "POST",
    uri: "http://node:8080/nsfw",
    body: [data],
    json: true,
    timeout: 2000
  });
  if (error) throw Error(error);
  if (pred.Neutral < 0.8 || pred.Porn + pred.Sexy > 0.2)
    throw Error("nsfw detected");
  console.log("sfw");
  return true;
};