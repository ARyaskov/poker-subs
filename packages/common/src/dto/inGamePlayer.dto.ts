import { Organization } from "../organization/dto/organization.dto";

export interface InGamePlayerDTO {
  playerId: string;
  name: string;
  totalOnlineTables: number;
  organizations: Organization[];
}
