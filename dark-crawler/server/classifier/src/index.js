const classify = require("./classify");
const fastify = require("fastify")({
  logger: true
});

fastify.get("/", async (request, reply) => {
  reply.type("application/json").code(200);
  return { success: 200 };
});

fastify.post("/nsfw", async (request, reply) => {
  reply.type("application/json").code(200);
  const base64image = request.body[0];

  try {
    const predictions = await classify.nsfw(base64image);
    return { result: predictions };
  } catch (error) {
    return { error: error.toString() };
  }
});

fastify.listen(8080, "0.0.0.0", (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
