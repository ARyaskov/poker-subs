import { Injectable } from "@nestjs/common";
import { PlayerDTO } from "common";

@Injectable()
export class PlayerService {
  /* prettier-ignore */
  players: PlayerDTO[] = [
        { playerId: '1a6f8993-56f3-4e21-af64-4c07c9e58e96', name: 'Alice', balanceAtCents: 2400 },
        { playerId: 'a3d0e2d4-57ac-4e12-8122-7cbf0a839f5c', name: 'Bob', balanceAtCents: 7800 },
        { playerId: 'b63a22c9-8f2e-423f-84b1-4b59f106d53a', name: 'Charlie', balanceAtCents: 4500 },
        { playerId: '76a1ac99-0b61-49d5-8a53-1c6ff5c194cc', name: 'David', balanceAtCents: 1100 },
        { playerId: 'e37659b8-c14a-485a-8695-1d8eb24f81c3', name: 'Eve', balanceAtCents: 3100 },
        { playerId: '18b7c135-d1b5-4a3a-a6d2-85c79474ef7d', name: 'Frank', balanceAtCents: 6500 },
        { playerId: 'c918c6b5-9ea0-4e01-8e2f-56d1488a9e66', name: 'Grace', balanceAtCents: 7800 },
        { playerId: 'd29d4a7d-5bf3-4ca7-9fb0-0db3f01ca317', name: 'Hannah', balanceAtCents: 2500 },
        { playerId: '35c28d84-2632-4a3e-9c17-724e5971c7e3', name: 'Ivy', balanceAtCents: 8900 },
        { playerId: 'e892f1b2-af48-45e5-aecb-4e65fcda8725', name: 'Jack', balanceAtCents: 5400 },
    ];

  getPlayer(playerId: string): PlayerDTO {
    return this.players.find((player) => player.playerId === playerId);
  }
}
