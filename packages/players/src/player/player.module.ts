import { Module } from "@nestjs/common";
import { RedisPubSubProvider } from "common";
import { PlayerService } from "./player.service";
import { ConfigModule } from "@nestjs/config";
import { PlayerResolver } from "./resolvers/queries/player.resolver";
const Joi = require("joi");

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_URI: Joi.string(),
        HOST: Joi.string(),
        PORT: Joi.number(),
      }),
    }),
  ],
  providers: [PlayerService, PlayerResolver, RedisPubSubProvider],
})
export class PlayerModule {}
