import { Observable } from "@apollo/client/core";
import { gql } from "graphql-request";
import { createClient } from "graphql-ws";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Client } from "graphql-ws/lib/client";
import { PlayerDTO } from "common";
import { WebSocket } from "ws";
require("dotenv").config();

function toObservable(operation, client) {
  return new Observable((observer) =>
    client.subscribe(operation, {
      next: (data) => observer.next(data),
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    }),
  );
}

describe("WebSocket GraphQL Query (e2e)", () => {
  let client: Client;
  let subscription;
  beforeAll(() => {
    client = createClient({
      url: `ws://${process.env.HOST}:${process.env.PORT}/api/v0/graphql`,
      webSocketImpl: WebSocket,
    });
  });

  it("graphql subscription", (done) => {
    const OFFLINE_PLAYER = gql`
      subscription offlinePlayer {
        offlinePlayer(
          filter: {
            playerId: "c918c6b5-9ea0-4e01-8e2f-56d1488a9e66"
            name: "Grace"
          }
        ) {
          playerId
          name
          balanceAtCents
        }
      }
    `;
    const observable = toObservable({ query: OFFLINE_PLAYER }, client);

    subscription = observable.subscribe({
      next: (data: { data: { offlinePlayer: PlayerDTO } }) => {
        expect(data.data.offlinePlayer).toEqual({
          playerId: "c918c6b5-9ea0-4e01-8e2f-56d1488a9e66",
          name: "Grace",
          balanceAtCents: 7800,
        });
        done();
      },
    });
  });

  afterAll(() => {
    subscription.unsubscribe();
  });
});
