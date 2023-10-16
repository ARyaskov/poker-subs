import { TableDTO } from "./table.dto";

export interface OccupiedTableDTO extends TableDTO {
  occupiedSeatsCount: number;
  bbAtCents: number;
}
