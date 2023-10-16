import { Module } from "@nestjs/common";
import { OccupiedTableResolver } from "./resolvers/subscriptions/occupiedTable.resolver";
import { RedisPubSubProvider } from "common";
import { OccupiedTableService } from "./occupiedTable.service";

@Module({
  providers: [RedisPubSubProvider, OccupiedTableService, OccupiedTableResolver],
})
export class OccupiedTableModule {}
