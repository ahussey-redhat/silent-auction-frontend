import { handleEffect, model } from '@modern-js/runtime/model';
import authModel from './auth';
import { Auction } from '@/types';

type EffectState<T> = {
  value: T;
  loading: boolean;
  error: string | null;
};

type State = {
  auctions: EffectState<Auction[]>;
};

const auctionModel = model<State>('auction').define((_, { use }) => ({
  state: {
    auctions: {
      value: [],
      loading: false,
      error: null,
    },
  },
  actions: {
    getAuctions: handleEffect({
      ns: 'auctions',
      result: 'value',
      pending: 'loading',
      combineMode: 'replace',
    }),
  },
  effects: {
    getAuctions: async () => {
      const [authState, authActions] = use(authModel);

      try {
        await authActions.updateToken();
      } catch (error) {
        await authActions.clearToken();
        return [];
      }

      const response = await fetch(`${process.env.BACKEND_URL}/auctions`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    },
  },
}));

export default auctionModel;
