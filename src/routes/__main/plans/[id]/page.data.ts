import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Plan, PlanMember } from '@/types';

export type LoaderData = {
  plan: Plan;
  planMembers: PlanMember[];
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
    planMembers: (async (): Promise<LoaderData['planMembers']> => {
      const response = await fetch(`/api/plans/${id}/members`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
