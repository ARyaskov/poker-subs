import { Module } from "@nestjs/common";
import { StatsResolver } from "./stats.resolver";
import { StatsService } from "./stats.service";

@Module({
  providers: [StatsService, StatsResolver],
})
export class StatsModule {}
