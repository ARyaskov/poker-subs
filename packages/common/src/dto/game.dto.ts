import { GameType } from "./common.dto";
import { SeatDTO } from "./seat.dto";

export interface GameDTO {
  gameType: GameType;
  bbInCents: number;
  anteInCents?: number;
  organizationId: string;
  size: number;
  seats: SeatDTO[];
}
