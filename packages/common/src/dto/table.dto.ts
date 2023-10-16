import { GameType } from "./common.dto";

export interface TableDTO {
  gameType: GameType;
  anteInCents?: number;
  organizationId: string;
  size: number;
}
