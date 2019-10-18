const { sameHostname, withTimeout } = require("/app/src/utils.js");
const request_client = require("request-promise-native");
const getHrefsFromString = require("get-hrefs");
var Agent = require("socks5-http-client/lib/Agent");
const UserAgent = require("user-agents");
const colors = require("colors");
const _ = require("lodash");

const unfollow = [
  "https:",
  "#",
  "?",
  ".png",
  ".ico",
  ".jpg",
  ".svg",
  ".gif",
  ".js",
  ".exe",
  ".dmg",
  ".css",
  ".xml"
];

const getBody = async url => {
  const timeout = 15000;
  try {
    console.log("in");
    const body = await withTimeout(
      timeout,
      request_client.get({
        url,
        timeout, // not working
        headers: {
          "User-Agent": new UserAgent().toString()
        },
        agentClass: Agent,
        agentOptions: {
          socksHost: "tor",
          socksPort: 9150
        }
      })
    );
    console.log("out");
    return body;
  } catch (error) {
    console.error(colors.red(error.toString().slice(0, 180)), url);
    return "";
  }
};

const _getUrls = body => {
  const urls = [
    ...getHrefsFromString(body, {
      allowedProtocols: {
        https: false
      }
    })
  ];
  const childs = urls
    .filter(url => url.indexOf(".onion") > -1)
    .filter(url => !unfollow.some(x => url.indexOf(x) !== -1));
  return childs;
};

const _getUrlsFromUrl = async url => {
  const body = await getBody(url);
  return _getUrls(body);
};

const getChildUrls = async (body, url, depth = 3) => {
  const indexurls = _getUrls(body);
  const childs = _.flatMapDeep(
    await Promise.all(
      indexurls
        .filter(childurl => sameHostname(url, childurl))
        .slice(0, depth)
        .map(childurl => _getUrlsFromUrl(childurl, url).catch(() => null))
    )
  ).filter(Boolean);
  const urls = [...indexurls, ...childs];
  return [...new Set(urls)];
};

module.exports = { getChildUrls, getBody };

// (async () => {
//   const urls = await getUrls(
//     "http://young-boy-mature-women-and-sex.iyearjmvxcgj2wymqxrgkcrek4f3p7gccgj2vdlrl5e4qbma6iue7nad.onion"
//   );
//   console.log(urls);
// })();
