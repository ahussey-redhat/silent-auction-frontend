import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Member, MemberPlan } from '@/types';

export type LoaderData = {
  member: Member;
  memberPlans: MemberPlan[];
};

export type DeferredLoaderData = DeferredData<LoaderData>;

export const loader = async ({ params: { id } }: LoaderFunctionArgs) =>
  defer({
    member: (async (): Promise<LoaderData['member']> => {
      const response = await fetch(`/api/members/${id}`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
    memberPlans: (async (): Promise<LoaderData['memberPlans']> => {
      const response = await fetch(`/api/members/${id}/plans`);

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
