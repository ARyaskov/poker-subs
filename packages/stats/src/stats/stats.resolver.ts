import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Query } from "@nestjs/graphql";
import { StatsDTO } from "./dto/stats.dto";
import { Inject } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Resolver("Stats")
export class StatsResolver {
  constructor(
    @Inject(StatsService) private readonly statsService: StatsService,
  ) {}

  @Mutation((returns) => Boolean)
  async updateTotalOnlinePlayers(
    @Args("newTotalOnlinePlayers") newTotalOnlinePlayers: number,
  ): Promise<boolean> {
    console.log("# Increasing total online players to", newTotalOnlinePlayers);
    this.statsService.updateTotalOnlinePlayers(newTotalOnlinePlayers);
    return true;
  }

  @Query("getGameStatistics")
  async getGameStatistics(): Promise<StatsDTO> {
    return this.statsService.getGameStatistics();
  }
}
