import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import "dotenv/config";

const pubSub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URI),
  subscriber: new Redis(process.env.REDIS_URI),
});

const RedisPubSubProvider = {
  provide: "REDIS_PUB_SUB",
  useValue: pubSub,
};

export { RedisPubSubProvider };
