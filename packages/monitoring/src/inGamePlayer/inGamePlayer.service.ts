import { Inject, Injectable } from "@nestjs/common";
import { gql } from "graphql-request";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { GameDTO, PlayerDTO } from "common";
import * as process from "process";
import * as _ from "lodash";
import { createClient } from "graphql-ws";
import { Client } from "graphql-ws/lib/client";
import { WebSocket } from "ws";

@Injectable()
export class InGamePlayerService {
  private readonly playerClient: Client;
  private readonly gamesClient: Client;

  constructor(@Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub) {
    this.playerClient = createClient({
      url: process.env.PLAYERS_ENDPOINT,
      webSocketImpl: WebSocket,
    });
    this.gamesClient = createClient({
      url: process.env.GAMES_ENDPOINT,
      webSocketImpl: WebSocket,
    });
  }

  countGamesByOrganization(games: GameDTO[]): Map<string, number> {
    const organizationGameCountMap = new Map<string, number>();

    for (const game of games) {
      const { organizationId } = game;

      if (organizationId) {
        if (organizationGameCountMap.has(organizationId)) {
          organizationGameCountMap.set(
            organizationId,
            organizationGameCountMap.get(organizationId)! + 1,
          );
        } else {
          organizationGameCountMap.set(organizationId, 1);
        }
      }
    }

    return organizationGameCountMap;
  }

  async getInGamePlayer(playerId: string) {
    const queryGetOfflinePlayer = gql`
      query getOfflinePlayer($playerId: String!) {
        getPlayer(playerId: $playerId) {
          name
        }
      }
    `;

    const resultGetOfflinePlayer: any = await this.playerClient
      .iterate({ query: queryGetOfflinePlayer, variables: { playerId } })
      .next();

    const offlinePlayerData: PlayerDTO = {
      ...resultGetOfflinePlayer.value.data.getPlayer,
    };

    const queryGetGames = gql`
      query getGames($playerId: String!) {
        getGames(playerId: $playerId) {
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
      .iterate({ query: queryGetGames, variables: { playerId } })
      .next();

    const getGamesData: GameDTO[] = _.values({
      ...resultGetGames.value.data.getGames,
    });

    const gameCounts = this.countGamesByOrganization(getGamesData);
    const organizationsField = Array.from(gameCounts.entries()).map(
      ([id, inGameTables]) => ({ id, inGameTables }),
    );

    return {
      inGamePlayer: {
        playerId: playerId,
        name: offlinePlayerData.name,
        totalOnlineTables: getGamesData.length,
        organizations: organizationsField,
      },
    };
  }
}
