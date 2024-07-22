import { Auction } from './auction';
import { Plan } from './plan';

export type PlanAuction = Auction & {
  planId: Plan['id'];
  auctionId: Auction['id'];
  joinDate: string;
};
