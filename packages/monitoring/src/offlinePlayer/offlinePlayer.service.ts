import { Inject, Injectable } from "@nestjs/common";
import { gql } from "graphql-request";
import { createClient } from "graphql-ws";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Client } from "graphql-ws/lib/client";
import { WebSocket } from "ws";

@Injectable()
export class OfflinePlayerService {
  private readonly statsClient: Client;
  private readonly playerClient: Client;

  constructor(@Inject("REDIS_PUB_SUB") private readonly pubSub: RedisPubSub) {
    this.statsClient = createClient({
      url: process.env.STATS_ENDPOINT,
      webSocketImpl: WebSocket,
    });

    this.playerClient = createClient({
      url: process.env.PLAYERS_ENDPOINT,
      webSocketImpl: WebSocket,
    });
  }

  async getOfflinePlayer(playerId: string) {
    const queryGetOfflinePlayer = gql`
      query getOfflinePlayer($playerId: String!) {
        getPlayer(playerId: $playerId) {
          playerId
          name
          balanceAtCents
        }
      }
    `;

    const resultGetOfflinePlayer: any = await this.playerClient
      .iterate({ query: queryGetOfflinePlayer, variables: { playerId } })
      .next();

    // Simple mutation just for example of mutating stats service state, there will be a complex logic of course
    const mutationStatsUsers = gql`
      mutation UpdateTotalOnlinePlayers($newTotalOnlinePlayers: Int!) {
        updateTotalOnlinePlayers(newTotalOnlinePlayers: $newTotalOnlinePlayers)
      }
    `;

    const resultUpdateTotalOnlinePLayers: any = await this.statsClient
      .iterate({
        query: mutationStatsUsers,
        variables: {
          newTotalOnlinePlayers: 25,
        },
      })
      .next();

    if (resultUpdateTotalOnlinePLayers.value.data.updateTotalOnlinePlayers) {
      console.log("Total users online successfully updated.");
    } else {
      console.log("ERROR while updating total users online!");
    }

    return {
      offlinePlayer: { ...resultGetOfflinePlayer.value.data.getPlayer },
    };
  }
}
