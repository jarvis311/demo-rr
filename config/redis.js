import { createClient } from "redis";
// console.log("=REDIS_HOST>>>>",process.env.REDIS_HOST);
// console.log("=REDIS_PORT>>>>",process.env.REDIS_PORT);
// console.log("=REDIS_USERNAME>>>>",process.env.REDIS_USERNAME);

const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USERNAME
  }
);
redisClient.on('error',err => console.log('Redis Client Error', err));
redisClient.on('connect',function() {
  console.log("Redis Connection SuccessFully !")
});
// await redisClient.connect();

export default redisClient;