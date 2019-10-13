const fs = require("fs");
const glob = require("globby");

glob("./logos/*.+(jpg|jpeg|gif|webp|png|tiff)").then(images =>
  fs.writeFile(
    "list.json",
    JSON.stringify(images),
    err => err && console.error(err)
  )
);
