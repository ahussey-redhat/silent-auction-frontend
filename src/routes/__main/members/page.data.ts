import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Member } from '@/types';

export const searchParams = ['search', 'status', 'risk'];

export type LoaderData = {
  members: Member[];
};

export type DeferredLoaderData = DeferredData<LoaderData>;

export const loader = async ({ request }: LoaderFunctionArgs) =>
  defer({
    members: (async (): Promise<LoaderData['members']> => {
      const requestUrl = new URL(request.url);
      const params = new URLSearchParams(
        searchParams
          .map((param): [string, string | null] => [
            param,
            requestUrl.searchParams.get(param),
          ])
          .filter((pair): pair is [string, string] => pair[1] !== null),
      );

      const response = await fetch(
        `/api/members${params.size > 0 ? `?${params}` : ''}`,
      );

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
