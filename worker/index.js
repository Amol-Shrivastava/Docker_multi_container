import redis from "redis";

(async () => {
  console.log("🚀 Worker container is starting up...");

  const redisHost = process.env.REDIS_HOST || "redis";
  const redisPort = process.env.REDIS_PORT || 6379;

  const redisClient = redis.createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
  });

  redisClient.on("error", (error) => {
    console.error("---ERROR IN CONNECTING TO REDIS DB WORKER----");
    console.error(error);
    process.exit(1);
  });

  await redisClient.connect();

  const sub = redisClient.duplicate();
  await sub.connect();

  function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
  }

  function fib2(n) {
    if (n < 2) return 1;
    let a = 1,
      b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  await sub.subscribe("insert", async (message) => {
    try {
      const index = parseInt(message);
      if (isNaN(index)) {
        console.warn(`Invalid index received: ${message}`);
        return;
      }

      console.log(`📥 Received new index: ${index}`);

      const result = fib2(index); // 💥 likely crashing here
      console.log(`📤 Storing result for index ${index}: ${result}`);

      await redisClient.hSet("values", index.toString(), result.toString());
    } catch (err) {
      console.error(`❌ Error while processing index ${message}:`, err);
    }
  });
})();
