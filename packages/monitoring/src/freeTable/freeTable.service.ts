import { Inject, Injectable } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { FreeTableDTO, GameDTO } from "common";
import * as process from "process";
import * as _ from "lodash";
import { gql } from "graphql-request";
import { createClient } from "graphql-ws";
import { WebSocket } from "ws";
import { Client } from "graphql-ws/lib/client";

@Injectable()
export class FreeTableService {
  private readonly gamesClient: Client;

  constructor(@Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub) {
    this.gamesClient = createClient({
      url: process.env.GAMES_ENDPOINT,
      webSocketImpl: WebSocket,
    });
  }

  async getFreeTables(): Promise<{ freeTable: FreeTableDTO[] }> {
    const queryGetGames = gql`
      query getGames {
        getGames {
          gameType
          bbInCents
          anteInCents
          organizationId
          size
          seats {
            playerId
            stackAtCents
            cards
          }
        }
      }
    `;

    const resultGetGames: any = await this.gamesClient
      .iterate({ query: queryGetGames })
      .next();

    const getGamesData: GameDTO[] = _.values({
      ...resultGetGames.value.data.getGames,
    });

    return {
      freeTable: getGamesData
        .filter((game) => game.seats.length === 0)
        .map((game) => _.omit(game, "seats")),
    };
  }
}
