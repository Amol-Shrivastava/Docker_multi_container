import { pgDB, pgHost, pgPassword, pgPort, pgUser } from "./keys.js";

//EXPRESS SETUP
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// CONNECT TO POSTGRES
import { Pool } from "pg";
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDB,
  password: pgPassword,
  port: pgPort,
});

pgClient.on("error", (err) =>
  console.error("---LOST PG CONNECTION---", err.message)
);

const pgSetup = async () => {
  try {
    await pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)");
    console.log("--SUCCESSFULLY CREATED TABLE values");
  } catch (error) {
    console.error("--FAILED TO CREATE THE TABLE IN PG ---", error.message);
    process.exit(1);
  }
};

pgSetup();

//REDIS SETUP
import redis from "redis";

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

redisClient.on("error", (error) => {
  console.error("---ERROR IN CONNECTING TO REDIS DB----");
  console.error(error);
  console.error(error.message);
  process.exit(1);
});

await redisClient.connect();

const redisPublisher = redisClient.duplicate();
await redisPublisher.connect();

//EXPRESS ROUTE HANDLERS

app.get("/", (req, res) => {
  res.send("Hi there, welcome to Fibonnacci calculator");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  //test comment
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  // redisClient.hGetAll("values", (err, values) => {
  //   res.send(values);
  // });
  let values = await redisClient.hGetAll("values");
  res.send(values);
});

app.post("/values", async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40)
    return res.status(422).send("Index to high. Value submitted is very large");

  await redisClient.hSet("values", index, "Nothing yet!");

  console.log("📣 Publishing index to Redis:", index);
  await redisPublisher.publish("insert", index);

  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  if (err) {
    console.error("error in running express server at port 5000");
    throw Error(err);
  }

  console.log("Listening at port 5000");
});
