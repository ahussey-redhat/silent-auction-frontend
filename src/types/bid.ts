export type BidDTO = {
  id: string;
  auction_id: number;
  user_id: number;
  bid_time: string;
  bid_amount: number;
};

export type Bid = {
  id: string;
  auctionId: number;
  userId: number;
  time: Date;
  amount: number;
};
