const fs = require("fs");
const colors = require("colors");

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
    .trim()
    .toLowerCase();

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

const isOnion = url => getHost(url) && getHost(url).endsWith(".onion");

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
  remove_duplicates,
  showerror,
  timeout,
  isOnion
};
