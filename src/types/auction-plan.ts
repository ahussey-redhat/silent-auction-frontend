import { Account } from './account';
import { Auction } from './auction';
import { Plan } from './plan';

export type AuctionPlan = Plan & {
  auctionId: Auction['id'];
  planId: Plan['id'];
  joinDate: string;
  active: boolean;
  account: Account;
};
