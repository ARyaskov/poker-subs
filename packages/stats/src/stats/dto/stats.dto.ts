import { GameType } from "common";

export interface StatsDTO {
  averageStackAtCents: number; // Average stack at cents
  totalActiveTables: number; // Overall active tables
  averagePlayersPerTable: number; // Average players per table
  totalOnlinePlayers: number; // Overall online players
  averageBalanceOfOfflinePlayers: number; // Average balance of offline players
  mostPopularGameType: GameType; // The most popular game type
}
