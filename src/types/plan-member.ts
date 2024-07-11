import { Member } from './member';
import { Plan } from './plan';

export type PlanMember = Member & {
  planId: Plan['id'];
  memberId: Member['id'];
  joinDate: string;
};
