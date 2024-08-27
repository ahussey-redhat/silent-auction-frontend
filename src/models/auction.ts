import { model } from '@modern-js/runtime/model';
import { EffectState, handleEffect, handleFetch, handlePost } from './utils';
import { Auction, AuctionDTO, Bid, BidDTO, PlaceBidRequest } from '@/types';

type State = {
  auctions: EffectState<Auction[]>;
  auction: EffectState<Auction | null>;
  bids: EffectState<Bid[]>;
  bid: EffectState<Bid | null>;
};

const mapAuction = ({
  id,
  item_name,
  description,
  auction_start,
  auction_end,
  starting_bid,
  image_path,
}: AuctionDTO): Auction => {
  const current = new Date();
  const start = new Date(`${auction_start}Z`);
  const end = new Date(`${auction_end}Z`);

  return {
    id: id.toString(),
    name: item_name,
    description,
    imageUrl: URL.canParse(image_path)
      ? new URL(image_path)
      : new URL(image_path, window.location.origin),
    start,
    end,
    isActive: current >= start && current < end,
    startingBid: starting_bid,
    highestBid: null,
  };
};

const mapBid = ({
  id,
  auction_id,
  user_id,
  bid_time,
  bid_amount,
}: BidDTO): Bid => ({
  id,
  auctionId: auction_id.toString(),
  userId: user_id.toString(),
  time: new Date(bid_time),
  amount: bid_amount,
});

const auctionModel = model<State>('auction').define((_, { use }) => ({
  state: {
    auctions: {
      value: [],
      loading: false,
      error: null,
    },
    auction: {
      value: null,
      loading: false,
      error: null,
    },
    bids: {
      value: [],
      loading: false,
      error: null,
    },
    bid: {
      value: null,
      loading: false,
      error: null,
    },
  },
  actions: {
    getAuctions: handleEffect('auctions'),
    getAuction: handleEffect('auction'),
    getBids: handleEffect('bids'),
    getHighestBids: handleEffect('bids'),
    updateHighestBid: handleEffect('auction'),
    placeBid: handleEffect('bid'),
  },
  effects: {
    getAuctions: handleFetch(use, 'auctions', [], (auctions: AuctionDTO[]) =>
      auctions.map(mapAuction),
    ),
    getAuction: async (auctionId: string): Promise<Auction | null> => {
      const auction = await handleFetch(
        use,
        `auctions/${auctionId}`,
        null,
        mapAuction,
      )();

      return auction
        ? {
            ...auction,
            highestBid: await handleFetch(
              use,
              `auctions/${auctionId}/bids/highest`,
              null,
              mapBid,
            )(),
          }
        : null;
    },
    getBids: (auctionId: string) =>
      handleFetch(use, `auctions/${auctionId}/bids`, [], (bids: BidDTO[]) =>
        bids.map(mapBid),
      ),
    getHighestBids: () =>
      handleFetch(use, `auctions/bids/highest`, [], (bids: BidDTO[]) =>
        bids.map(mapBid),
      ),
    updateHighestBid: async (auctionId: string): Promise<Auction | null> => {
      const highestBid = await handleFetch(
        use,
        `auctions/${auctionId}/bids/highest`,
        null,
        mapBid,
      )();
      const [
        {
          auction: { value: auction },
        },
      ] = use(auctionModel);

      return auction
        ? {
            ...auction,
            highestBid,
          }
        : null;
    },
    clearAuction: () => {
      const [, actions] = use(auctionModel);

      actions.setAuction({
        value: null,
        loading: false,
        error: null,
      });

      actions.setBids({
        value: [],
        loading: false,
        error: null,
      });
    },
    placeBid: (auctionId: string, placeBidRequest: PlaceBidRequest) =>
      handlePost(
        use,
        `auctions/${auctionId}/bids`,
        null,
        mapBid,
        placeBidRequest,
      )(),
  },
}));

export default auctionModel;
