import { Args, Query, Resolver } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { GamesService } from "../../games.service";
import { GameDTO } from "common";

@Resolver("Query")
export class GamesResolver {
  constructor(
    @Inject(GamesService) private readonly gamesService: GamesService,
  ) {}

  @Query("getGames")
  async getGames(
    @Args("playerId", { nullable: true, defaultValue: null })
    playerId: string | null,
  ): Promise<GameDTO[]> {
    let games: GameDTO[];
    if (playerId) {
      games = this.gamesService.getGamesByPlayer(playerId);
    } else {
      games = this.gamesService.getGames();
    }
    if (!games.length) {
      throw new Error("No games found");
    }
    return games;
  }
}
