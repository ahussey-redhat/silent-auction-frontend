import { handleEffect, model, useModel } from '@modern-js/runtime/model';
import authModel from './auth';
import { Auction } from '@/types';

type EffectState<T> = {
  value: T;
  loading: boolean;
  error: string | null;
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

    if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
      throw response;
    }

    return await response.json();
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
