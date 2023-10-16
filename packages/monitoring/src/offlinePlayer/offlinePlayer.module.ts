import { Module } from "@nestjs/common";
import { OfflinePlayerResolver } from "./resolvers/subscriptions/offlinePlayer.resolver";
import { RedisPubSubProvider } from "common";
import { GraphQLClient } from "graphql-request";
import { OfflinePlayerService } from "./offlinePlayer.service";

@Module({
  providers: [
    GraphQLClient,
    RedisPubSubProvider,
    OfflinePlayerService,
    OfflinePlayerResolver,
  ],
})
export class OfflinePlayerModule {}
