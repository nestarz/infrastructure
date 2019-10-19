const classify = require("./classify");
const getBase64 = require("./base64");

const fastify = require("fastify")({
  logger: true
});

fastify.get("/", async (request, reply) => {
  reply.type("application/json").code(200);
  return { success: 200 };
});

const cache = {};
fastify.post("/nsfw", async (request, reply) => {
  reply.type("application/json").code(200);
  const url = request.body[0];

  if (cache[url]) return cache[url];
  else if (cache.length > 1000) {
    cache = {};
  }

  try {
    const base64image = await getBase64(url);
    const predictions = await classify.nsfw(base64image);
    console.log(url, predictions.Porn);
    const response = { data: predictions, error: null };
    cache[url] = response;
    return response;
  } catch (error) {
    const response = { data: null, error: error.toString() };
    cache[url] = response;
    return response;
  }
});

fastify.listen(8080, "0.0.0.0", (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
