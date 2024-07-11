import { To, useLocation } from '@modern-js/runtime/router';

export default (params: [name: string, value: string][]): To => {
  const location = useLocation();

  const search = new URLSearchParams(location.search);

  for (const [name, value] of params) {
    search.set(name, value);
  }

  return {
    ...location,
    search: search.toString(),
  };
};
