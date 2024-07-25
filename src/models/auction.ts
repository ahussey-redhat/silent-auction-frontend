import { handleEffect, model, useModel } from '@modern-js/runtime/model';
import authModel from './auth';
import { Auction, AuctionDTO } from '@/types';

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
  };
};

const fetchAuctions =
  <T>(use: typeof useModel, stub: T) =>
  async (id?: string): Promise<T> => {
    const [authState, authActions] = use(authModel);

    try {
      await authActions.updateToken();
    } catch (error) {
      await authActions.clearToken();
      return stub;
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/auctions${id ? `/${id}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw response;
    }

    const result = await response.json();

    return id ? mapAuction(result) : result.map(mapAuction);
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
    getAuctions: fetchAuctions<Auction[]>(use, []),
    getAuction: async (id: string) =>
      fetchAuctions<Auction | null>(use, null)(id),
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
