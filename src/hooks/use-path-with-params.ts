import { Path, To, useLocation } from '@modern-js/runtime/router';

export default (path: To, params: string[]): Partial<Path> => {
  const location = useLocation();

  const currentSearch = new URLSearchParams(location.search);
  const toSearch = new URLSearchParams();

  for (const param of params) {
    if (currentSearch.has(param)) {
      toSearch.set(param, currentSearch.get(param)!);
    }
  }

  const url = new URL(
    typeof path === 'string'
      ? path
      : `${path.pathname}${path.search}${path.hash}`,
    window.location.origin,
  );

  return {
    pathname: url.pathname,
    search: toSearch.toString(),
    hash: url.hash,
  };
};
