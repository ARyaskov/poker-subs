import { GameType } from "common";
import { StatsDTO } from "./dto/stats.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StatsService {
  mockStats: StatsDTO;

  // We're using mock data here. There will be a complex logic with db/message broker quering/subscriptions
  constructor() {
    this.mockStats = {
      averageStackAtCents: 1500.5,
      totalActiveTables: 10,
      averagePlayersPerTable: 5.5,
      totalOnlinePlayers: 55,
      averageBalanceOfOfflinePlayers: 1200.3,
      mostPopularGameType: GameType.NLH,
    };
  }

  updateTotalOnlinePlayers(newTotalOnlinePlayers) {
    this.mockStats.totalOnlinePlayers = newTotalOnlinePlayers;
  }

  getGameStatistics(): StatsDTO {
    return this.mockStats;
  }
}
