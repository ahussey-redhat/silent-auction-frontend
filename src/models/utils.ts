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
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });

    if (
      retryOptions.statusCodes.includes(response.status) &&
      retryOptions.maxRetries > 0
    ) {
      return await handleFetch(use, path, stub, callback, {
        ...retryOptions,
        maxRetries: retryOptions.maxRetries - 1,
      })();
    }

    if (response.status === 404) {
      return stub;
    }

    if (response.status !== 200) {
      throw response;
    }

    return callback(await response.json());
  };
