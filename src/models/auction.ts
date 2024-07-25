import { handleEffect, model, useModel } from '@modern-js/runtime/model';
import authModel from './auth';
import { Auction, AuctionDTO, Bid, BidDTO } from '@/types';

type EffectState<T> = {
  value: T;
  loading: boolean;
  error: Response | null;
};

type State = {
  auctions: EffectState<Auction[]>;
  auction: EffectState<Auction | null>;
};

const handleAuctionEffect = (ns: string) =>
  handleEffect({
    ns,
    result: 'value',
    pending: 'loading',
    combineMode: 'replace',
  });

const mapAuction = ({
  id,
  item_name,
  description,
  auction_start,
  auction_end,
  image_path,
}: AuctionDTO): Auction => {
  const current = new Date();
  const start = new Date(auction_start);
  const end = new Date(auction_end);

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
  auctionId: auction_id,
  userId: user_id,
  time: new Date(bid_time),
  amount: bid_amount,
});

const handleFetch =
  <DTO, T>(
    use: typeof useModel,
    path: string,
    stub: T,
    callback: (result: DTO) => T,
  ) =>
  async (): Promise<T> => {
    const [authState, authActions] = use(authModel);

    try {
      await authActions.updateToken();
    } catch (error) {
      await authActions.clearToken();
      return stub;
    }

    const response = await fetch(`${process.env.BACKEND_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });

    if (response.status !== 200) {
      throw response;
    }

    return callback(await response.json());
  };

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
  },
  actions: {
    getAuctions: handleAuctionEffect('auctions'),
    getAuction: handleAuctionEffect('auction'),
  },
  effects: {
    getAuctions: handleFetch(use, 'auctions', [], (auctions: AuctionDTO[]) =>
      auctions.map(mapAuction),
    ),
    getAuction: async (id: string): Promise<Auction | null> => {
      const auction = await handleFetch(
        use,
        `auctions/${id}`,
        null,
        mapAuction,
      )();

      return auction
        ? {
            ...auction,
            highestBid: await handleFetch(
              use,
              `auctions/${id}/bids/highest`,
              null,
              mapBid,
            )(),
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
    },
  },
}));

export default auctionModel;
