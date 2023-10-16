import { Module } from "@nestjs/common";
import { InGamePlayerResolver } from "./resolvers/subscriptions/inGamePlayer.resolver";
import { RedisPubSubProvider } from "common";
import { InGamePlayerService } from "./inGamePlayer.service";

@Module({
  imports: [],
  providers: [RedisPubSubProvider, InGamePlayerService, InGamePlayerResolver],
})
export class InGamePlayerModule {}
