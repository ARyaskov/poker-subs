import { Inject, Injectable } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { GameDTO, OccupiedTableDTO } from "common";
import * as process from "process";
import * as _ from "lodash";
import { gql } from "graphql-request";
import { createClient } from "graphql-ws";
import { Client } from "graphql-ws/lib/client";
import { WebSocket } from "ws";

@Injectable()
export class OccupiedTableService {
  private readonly gamesClient: Client;

  constructor(@Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub) {
    this.gamesClient = createClient({
      url: process.env.GAMES_ENDPOINT,
      webSocketImpl: WebSocket,
    });
  }

  async getOccupiedTables(): Promise<{ occupiedTable: OccupiedTableDTO[] }> {
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
      occupiedTable: getGamesData
        .filter((game) => game.seats.length !== 0)
        .map((game) => {
          const bbAtInCents = game.bbInCents;
          const anteAtInCents = game.anteInCents;
          return {
            ..._.omit(game, ["seats", "bbInCents", "anteInCents"]),
            bbAtCents: bbAtInCents,
            anteAtCents: anteAtInCents,
            occupiedSeatsCount: game.seats.length,
          };
        }),
    };
  }
}
