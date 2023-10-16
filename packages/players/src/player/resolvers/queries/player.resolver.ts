import { Args, Query, Resolver } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { PlayerService } from "../../player.service";
import { PlayerDTO } from "common";

@Resolver("Query")
export class PlayerResolver {
  constructor(
    @Inject(PlayerService) private readonly playerService: PlayerService,
  ) {}

  @Query("getPlayer")
  async getPlayer(@Args("playerId") playerId: string): Promise<PlayerDTO> {
    const player: PlayerDTO = this.playerService.getPlayer(playerId);
    if (!player) {
      throw new Error("Player not found");
    }
    return player;
  }
}
