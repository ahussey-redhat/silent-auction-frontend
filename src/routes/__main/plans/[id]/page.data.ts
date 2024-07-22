import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Plan, PlanAuction } from '@/types';

export type LoaderData = {
  plan: Plan;
  planAuctions: PlanAuction[];
};

export type DeferredLoaderData = DeferredData<LoaderData>;

export const loader = async ({ params: { id } }: LoaderFunctionArgs) =>
  defer({
    plan: (async (): Promise<LoaderData['plan']> => {
      const response = await fetch(`/api/plans/${id}`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
    planAuctions: (async (): Promise<LoaderData['planAuctions']> => {
      const response = await fetch(`/api/plans/${id}/auctions`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
