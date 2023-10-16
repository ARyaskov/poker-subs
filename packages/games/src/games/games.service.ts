import { Injectable } from "@nestjs/common";
import { GameDTO, GameType } from "common";

@Injectable()
export class GamesService {
  /* prettier-ignore */
  games: GameDTO[] = [
    {
      gameType: GameType.NLH,
      bbInCents: 100,
      organizationId: 'org1',
      size: 6,
      seats: [
        { playerId: '1a6f8993-56f3-4e21-af64-4c07c9e58e96', stackAtCents: 2400, cards: ['As', 'Kd'] },
        { playerId: 'a3d0e2d4-57ac-4e12-8122-7cbf0a839f5c', stackAtCents: 7800, cards: ['Jh', '7c'] }
      ]
    },
    {
      gameType: GameType.PLO,
      bbInCents: 200,
      anteInCents: 25,
      organizationId: 'org2',
      size: 5,
      seats: [
        { playerId: 'b63a22c9-8f2e-423f-84b1-4b59f106d53a', stackAtCents: 4500, cards: ['10s', '5h', '3c', '2d'] },
        { playerId: '76a1ac99-0b61-49d5-8a53-1c6ff5c194cc', stackAtCents: 1100, cards: ['Qs', 'Qh', '2c', '9d'] }
      ]
    },
    {
      gameType: GameType.NLH,
      bbInCents: 100,
      organizationId: 'org2',
      size: 3,
      seats: []
    },
  ];

  getGamesByPlayer(playerId: string): GameDTO[] {
    const gamesWithPlayer = this.games.filter((game) =>
      game.seats.some((seat) => seat.playerId === playerId),
    );
    return gamesWithPlayer;
  }

  getGames(): GameDTO[] {
    return this.games;
  }
}
