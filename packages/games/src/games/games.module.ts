import { Module } from "@nestjs/common";
import { GamesResolver } from "./resolvers/subscriptions/games.resolver";
import { RedisPubSubProvider } from "common";
import { GamesService } from "./games.service";

@Module({
  providers: [RedisPubSubProvider, GamesService, GamesResolver],
})
export class GamesModule {}
