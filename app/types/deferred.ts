export type DeferredData<T extends object> = {
  [K in keyof T]: Promise<T[K]>;
};
