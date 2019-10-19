const classify = require("./classify");
const getBase64 = require("./get");

const fastify = require("fastify")({
  logger: true
});

fastify.get("/", async (request, reply) => {
  reply.type("application/json").code(200);
  return { success: 200 };
});

const cache = {};
fastify.post("/nsfw", async ({ body: [url] }, reply) => {
  reply.type("application/json").code(200);

  if (cache[url]) return cache[url];
  else if (cache.length > 1000) cache = {};
  try {
    const base64image = await getBase64(url);
    const predictions = await classify.nsfw(base64image);
    cache[url] = { data: predictions, error: null };
  } catch (error) {
    cache[url] = { data: null, error: error.toString() };
  }
  return cache[url];
});

fastify.listen(8080, "0.0.0.0", (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
