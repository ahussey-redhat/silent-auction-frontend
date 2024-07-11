import { Account } from './account';
import { Member } from './member';
import { Plan } from './plan';

export type MemberPlan = Plan & {
  memberId: Member['id'];
  planId: Plan['id'];
  joinDate: string;
  active: boolean;
  account: Account;
};
