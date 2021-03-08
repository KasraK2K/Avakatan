import { LeadManagerEntity } from '../entities/lead-manager.entity';

export interface SearchLeadManagerAndCount {
  result: LeadManagerEntity[];
  count: number;
}
