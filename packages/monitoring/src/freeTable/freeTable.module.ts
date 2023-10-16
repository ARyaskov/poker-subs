import { Module } from "@nestjs/common";
import { FreeTableResolver } from "./resolvers/subscriptions/freeTable.resolver";
import { RedisPubSubProvider } from "common";
import { FreeTableService } from "./freeTable.service";

@Module({
  providers: [RedisPubSubProvider, FreeTableService, FreeTableResolver],
})
export class FreeTableModule {}
