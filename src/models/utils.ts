import {
  handleEffect as handleModelEffect,
  useModel,
} from '@modern-js/runtime/model';
import authModel from './auth';

export type EffectState<T> = {
  value: T;
  loading: boolean;
  error: Response | null;
};

export const handleEffect = (ns?: string) =>
  handleModelEffect({
    ns,
    result: 'value',
    pending: 'loading',
    combineMode: 'replace',
  });

export type RetryOptions = {
  maxRetries: number;
  statusCodes: number[];
};

export const handleFetch =
  <DTO, T>(
    use: typeof useModel,
    path: string,
    stub: T,
    callback: (result: DTO) => T,
    init: RequestInit = {},
    retryOptions: RetryOptions = {
      maxRetries: 10,
      statusCodes: [401, 403],
    },
  ) =>
  async (): Promise<T> => {
    const [authState, authActions] = use(authModel);

    try {
      await authActions.updateToken();
    } catch (error) {
      await authActions.clearToken();
      return stub;
    }

    const response = await fetch(`${process.env.BACKEND_URL}/${path}`, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${authState.token}`,
      },
    });

    if (
      retryOptions.statusCodes.includes(response.status) &&
      retryOptions.maxRetries > 0
    ) {
      return await handleFetch(use, path, stub, callback, init, {
        ...retryOptions,
        maxRetries: retryOptions.maxRetries - 1,
      })();
    }

    if (response.status === 404) {
      return stub;
    }

    if (response.status >= 200 && response.status < 300) {
      return callback(await response.json());
    }

    console.log('hello');
    throw response;
  };

export const handlePost = <DTO, T, Body extends object>(
  use: typeof useModel,
  path: string,
  stub: T,
  callback: (result: DTO) => T,
  body: Body,
  init: RequestInit = {},
  retryOptions: RetryOptions = {
    maxRetries: 10,
    statusCodes: [401, 403],
  },
) =>
  handleFetch<DTO, T>(
    use,
    path,
    stub,
    callback,
    {
      ...init,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    retryOptions,
  );
