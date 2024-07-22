import { defer, LoaderFunctionArgs } from '@modern-js/runtime/router';
import type { DeferredData, Auction } from '@/types';

export const searchParams = ['search', 'status', 'risk'];

export type LoaderData = {
  auctions: Auction[];
};

export type DeferredLoaderData = DeferredData<LoaderData>;

export const loader = async ({ request }: LoaderFunctionArgs) =>
  defer({
    auctions: (async (): Promise<LoaderData['auctions']> => {
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
        `/api/auctions${params.size > 0 ? `?${params}` : ''}`,
      );

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return await response.json();
    })(),
  });
