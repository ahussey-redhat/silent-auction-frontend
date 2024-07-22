import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Auction, AuctionPlan } from '@/types';

export type LoaderData = {
  auction: Auction;
  auctionPlans: AuctionPlan[];
};

export type DeferredLoaderData = DeferredData<LoaderData>;

export const loader = async ({ params: { id } }: LoaderFunctionArgs) =>
  defer({
    auction: (async (): Promise<LoaderData['auction']> => {
      const response = await fetch(`/api/auctions/${id}`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
    auctionPlans: (async (): Promise<LoaderData['auctionPlans']> => {
      const response = await fetch(`/api/auctions/${id}/plans`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
