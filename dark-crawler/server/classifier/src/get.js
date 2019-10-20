const UserAgent = require("user-agents");
const axios = require("axios");
const sharp = require("sharp");
const Agent = require("socks5-http-client/lib/Agent");

const client = axios.create({
  httpAgent: new Agent({
    socksHost: "tor",
    socksPort: 9050
  })
});

const getBase64 = async url => {
  const image = await client.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent": new UserAgent().toString()
    }
  });
  let buffer = await sharp(Buffer.from(image.data))
    .resize(224, 224, {
      kernel: sharp.kernel.nearest,
      fit: "contain",
      background: { r: 0, g: 0, b: 0 }
    })
    .toFormat("jpg")
    .toBuffer();
  const base64 = buffer.toString("base64");
  return `data:image/jpg;base64,${base64}`;
};

module.exports = getBase64;
